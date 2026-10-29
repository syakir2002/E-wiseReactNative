import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded  bg-success text-white p-4"
      >
        Go To Onboarding
      </Link>
      <Link href="/sign-in" className="mt-4 rounded  bg-success text-white p-4">
        Go To Sign In
      </Link>
      <Link href="/sign-up" className="mt-4 rounded  bg-success text-white p-4">
        Go To Sign Up
      </Link>
      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "spotify" },
        }}
        className="mt-4 rounded bg-success p-4 text-white"
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
    </View>
  );
}
