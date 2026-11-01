import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5">
      <Text className="text-7xl font-bold text-primary"> Home </Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded  bg-success text-white p-4"
      >
        Go To Onboarding
      </Link>
      <Link href="/sign-in" className="mt-4 font-sans-bold rounded  bg-success text-white p-4">
        Go To Sign In
      </Link>
      <Link href="/sign-up" className="mt-4 font-sans-bold rounded  bg-success text-white p-4">
        Go To Sign Up
      </Link>
      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "spotify" },
        }}
        className="mt-4 font-sans-bold rounded bg-success p-4 text-white"
      >
        Go To Spotify Subscription
      </Link>
      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "123" },
        }}
        className="mt-4 rounded bg-success p-4 text-white"
      >
        Claude Max Subscriptions
      </Link>
    </SafeAreaView>
  );
}
