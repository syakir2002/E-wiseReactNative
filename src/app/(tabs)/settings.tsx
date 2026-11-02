import { posthog } from "@/lib/posthog";
import { useClerk } from "@clerk/expo";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage("");

    try {
      posthog?.capture("user_signed_out");
      posthog?.logger.info("authentication sign-out requested", {
        auth_flow: "sign_out",
      });
      await signOut({ redirectUrl: "/sign-in" });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign out. Please try again.",
      );
      setIsSigningOut(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-primary">Settings</Text>

      <View className="mt-8 rounded-2xl border border-border bg-card p-5">
        <Text className="text-lg font-sans-bold text-primary">Account</Text>
        <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
          Sign out of your Recurly account on this device.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isSigningOut }}
          className="mt-5 min-h-12 flex-row items-center justify-center rounded-xl bg-accent px-4"
          disabled={isSigningOut}
          onPress={handleSignOut}
        >
          {isSigningOut ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="font-sans-semibold text-white">Log out</Text>
          )}
        </Pressable>

        {errorMessage ? (
          <Text className="mt-3 text-sm text-destructive">{errorMessage}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default Settings;
