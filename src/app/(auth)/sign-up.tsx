import { Link } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSignUp() {
    setMessage("Sign up is not connected to an authentication service yet.");
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md self-center">
          <Text className="text-3xl font-bold text-slate-900">Create account</Text>
          <Text className="mt-2 text-base text-slate-600">
            Sign up to get started with E-Wise.
          </Text>

          <Text className="mb-2 mt-8 font-medium text-slate-800">Name</Text>
          <TextInput
            accessibilityLabel="Name"
            autoComplete="name"
            className="rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900"
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#64748b"
            value={name}
          />

          <Text className="mb-2 mt-5 font-medium text-slate-800">Email</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoComplete="email"
            className="rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#64748b"
            value={email}
          />

          <Text className="mb-2 mt-5 font-medium text-slate-800">Password</Text>
          <TextInput
            accessibilityLabel="Password"
            autoComplete="new-password"
            className="rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900"
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={password}
          />

          <Pressable
            accessibilityRole="button"
            className="mt-7 items-center rounded-xl bg-primary px-4 py-4"
            onPress={handleSignUp}
          >
            <Text className="font-semibold text-white">Sign Up</Text>
          </Pressable>
          {message ? (
            <Text className="mt-3 text-center text-slate-600">{message}</Text>
          ) : null}

          <View className="mt-6 flex-row justify-center">
            <Text className="text-slate-600">Already have an account? </Text>
            <Link className="font-semibold text-primary" href="/sign-in">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
