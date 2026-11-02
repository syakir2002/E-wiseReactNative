import "@/global.css";
import { SubscriptionsProvider } from "@/context/SubscriptionsContext";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack, usePathname } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useRef } from "react";

import { posthog } from "@/lib/posthog";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (typeof publishableKey !== "string" || publishableKey.length === 0) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your .env file.",
  );
}

function PostHogScreenTracking() {
  const pathname = usePathname();
  const screenName = pathname.startsWith("/subscriptions/")
    ? "/subscriptions/[id]"
    : pathname;

  useEffect(() => {
    posthog?.screen(screenName);
  }, [screenName]);

  return null;
}

function PostHogIdentity() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const identifiedUserId = useRef<string | null>();

  useEffect(() => {
    if (!posthog || !isAuthLoaded) return;

    if (!isSignedIn) {
      if (identifiedUserId.current !== null) {
        posthog.reset();
        identifiedUserId.current = null;
      }
      return;
    }

    if (!isUserLoaded || !user || identifiedUserId.current === user.id) return;

    const personProperties: Record<string, string> = {};
    const email = user.primaryEmailAddress?.emailAddress;

    if (email) personProperties.email = email;
    if (user.firstName) personProperties.first_name = user.firstName;
    if (user.lastName) personProperties.last_name = user.lastName;

    posthog.identify(user.id, { $set: personProperties });
    identifiedUserId.current = user.id;
  }, [isAuthLoaded, isSignedIn, isUserLoaded, user]);

  return null;
}

export default function RootLayout() {
  const content = (
    <>
      <PostHogScreenTracking />
      <PostHogIdentity />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SubscriptionsProvider>
        {posthog ? (
          <PostHogProvider client={posthog}>{content}</PostHogProvider>
        ) : (
          content
        )}
      </SubscriptionsProvider>
    </ClerkProvider>
  );
}
