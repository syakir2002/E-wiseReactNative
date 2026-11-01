import AuthInput from "@/component/AuthInput";
import AuthScreen from "@/component/AuthScreen";
import { posthog } from "@/lib/posthog";
import { useSignUp } from "@clerk/expo";
import clsx from "clsx";
import { Link, router, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [message, setMessage] = useState("");

  const isLoading = fetchStatus === "fetching";

  async function finishSignUp() {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setMessage("Complete the required account step before continuing.");
          return;
        }

        posthog?.capture("user_signed_up");
        posthog?.logger.info("authentication sign-up completed", {
          auth_flow: "sign_up",
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

  async function handleSignUp() {
    setMessage("");

    try {
      const { error } = await signUp.password({
        emailAddress: email.trim(),
        password,
        firstName: name.trim(),
      });

      if (error) return;

      if (signUp.status === "complete") {
        await finishSignUp();
      } else if (
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields.includes("email_address")
      ) {
        const { error: codeError } =
          await signUp.verifications.sendEmailCode();
        if (!codeError) setPendingVerification(true);
      } else {
        setMessage("Sign-up could not be completed. Please try again.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign up. Please check your connection and try again.",
      );
    }
  }

  async function handleVerifyCode() {
    setMessage("");

    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });
      if (error) return;

      if (signUp.status === "complete") {
        await finishSignUp();
      } else {
        setMessage("Sign-up needs more information. Please contact support.");
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
      const { error } = await signUp.verifications.sendEmailCode();
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
      title={pendingVerification ? "Verify your email" : "Create your account"}
      subtitle={
        pendingVerification
          ? "Enter the code we sent to your email"
          : "Start managing your subscriptions in one place"
      }
    >
      <View className="auth-form">
        {pendingVerification ? (
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
                {isLoading ? "Verifying..." : "Verify email"}
              </Text>
            </Pressable>
            <View className="auth-link-row">
              <Text className="auth-link-copy">Didn't receive a code?</Text>
              <Pressable disabled={isLoading} onPress={handleResendCode}>
                <Text className="auth-link">Resend</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <AuthInput
              label="Name"
              autoComplete="name"
              onChangeText={setName}
              placeholder="Enter your name"
              value={name}
              error={errors.fields.firstName?.message}
            />
            <AuthInput
              label="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Enter your email"
              value={email}
              error={errors.fields.emailAddress?.message}
            />
            <AuthInput
              label="Password"
              autoComplete="new-password"
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              value={password}
              error={errors.fields.password?.message}
            />
            <Pressable
              accessibilityRole="button"
              className={clsx("auth-button", isLoading && "auth-button-disabled")}
              disabled={isLoading || !name.trim() || !email.trim() || !password}
              onPress={handleSignUp}
            >
              <Text className="auth-button-text">
                {isLoading ? "Creating account..." : "Create account"}
              </Text>
            </Pressable>
            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link className="auth-link" href="/sign-in">
                Sign in
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
        <View nativeID="clerk-captcha" />
      </View>
    </AuthScreen>
  );
}
