import brandLogo from "@/assets/icons/logo.png";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { PropsWithChildren } from "react";

interface AuthScreenProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export default function AuthScreen({
  title,
  subtitle,
  children,
}: AuthScreenProps) {
  return (
    <KeyboardAvoidingView
      className="auth-screen"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 36,
          paddingBottom: 28,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="auth-container">
          <View className="auth-brand">
            <Image source={brandLogo} className="auth-brand-mark" />
            <View>
              <Text className="auth-brand-name">Recurly</Text>
              <Text className="auth-brand-tagline">SMART BILLING</Text>
            </View>
          </View>

          <Text className="auth-title">{title}</Text>
          <Text className="auth-subtitle">{subtitle}</Text>

          <View className="auth-card">{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
