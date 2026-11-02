import AuthInput from "@/component/AuthInput";
import AuthScreen from "@/component/AuthScreen";
import { posthog } from "@/lib/posthog";
import { useSignIn } from "@clerk/expo";
import clsx from "clsx";
import { Link, router, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const isLoading = fetchStatus === "fetching";
  const needsEmailCode = signIn.status === "needs_client_trust";

  async function finishSignIn() {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setMessage("Complete the required account step before continuing.");
          return;
        }

        posthog?.capture("user_signed_in");
        posthog?.logger.info("authentication sign-in completed", {
          auth_flow: "sign_in",
        });

        const url = decorateUrl("/");
        if (url.startsWith("http") && typeof window !== "undefined") {
          window.location.href = url;
          return;
        }

        router.replace(url as Href);
      },
    });
  }

  async function handleSignIn() {
    setMessage("");

    try {
      const { error } = await signIn.password({
        emailAddress: email.trim(),
        password,
      });

      if (error) return;

      if (signIn.status === "complete") {
        await finishSignIn();
      } else if (signIn.status === "needs_client_trust") {
        await signIn.mfa.sendEmailCode();
      } else if (signIn.status === "needs_second_factor") {
        setMessage(
          "This account requires a verification method that this sign-in form does not support yet.",
        );
      } else {
        setMessage("Sign-in could not be completed. Please try again.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please check your connection and try again.",
      );
    }
  }

  async function handleVerifyCode() {
    setMessage("");

    try {
      const { error } = await signIn.mfa.verifyEmailCode({ code: code.trim() });
      if (error) return;

      if (signIn.status === "complete") {
        await finishSignIn();
      } else {
        setMessage("The verification is not complete. Check the code and retry.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to verify the code. Please try again.",
      );
    }
  }

  async function handleResendCode() {
    setMessage("");

    try {
      const { error } = await signIn.mfa.sendEmailCode();
      if (!error) setMessage("A new verification code has been sent.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to send a new code. Please try again.",
      );
    }
  }

  return (
    <AuthScreen
      title={needsEmailCode ? "Verify your account" : "Welcome back"}
      subtitle={
        needsEmailCode
          ? "Enter the code we sent to your email"
          : "Sign in to continue managing your subscriptions"
      }
    >
      <View className="auth-form">
        {needsEmailCode ? (
          <>
            <AuthInput
              label="Verification code"
              autoComplete="one-time-code"
              keyboardType="number-pad"
              onChangeText={setCode}
              placeholder="Enter your code"
              value={code}
              error={errors.fields.code?.message}
              className="text-center tracking-[4px]"
            />
            <Pressable
              accessibilityRole="button"
              className={clsx("auth-button", isLoading && "auth-button-disabled")}
              disabled={isLoading || !code.trim()}
              onPress={handleVerifyCode}
            >
              <Text className="auth-button-text">
                {isLoading ? "Verifying..." : "Verify"}
              </Text>
            </Pressable>
            <View className="auth-link-row">
              <Text className="auth-link-copy">Didn't receive a code?</Text>
              <Pressable disabled={isLoading} onPress={handleResendCode}>
                <Text className="auth-link">Resend</Text>
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              className="auth-secondary-button"
              disabled={isLoading}
              onPress={() => signIn.reset()}
            >
              <Text className="auth-secondary-button-text">Start over</Text>
            </Pressable>
          </>
        ) : (
          <>
            <AuthInput
              label="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Enter your email"
              value={email}
              error={errors.fields.identifier?.message}
            />
            <AuthInput
              label="Password"
              autoComplete="current-password"
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              error={errors.fields.password?.message}
            />
            <Pressable
              accessibilityRole="button"
              className={clsx("auth-button", isLoading && "auth-button-disabled")}
              disabled={isLoading || !email.trim() || !password}
              onPress={handleSignIn}
            >
              <Text className="auth-button-text">
                {isLoading ? "Signing in..." : "Sign in"}
              </Text>
            </Pressable>
            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Recurly?</Text>
              <Link className="auth-link" href="/sign-up">
                Create an account
              </Link>
            </View>
          </>
        )}

        {errors.global?.[0]?.message ? (
          <Text className="auth-error text-center">
            {errors.global[0].message}
          </Text>
        ) : null}
        {message ? (
          <Text className="auth-error text-center">{message}</Text>
        ) : null}
      </View>
    </AuthScreen>
  );
}
