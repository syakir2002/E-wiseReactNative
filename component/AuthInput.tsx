import clsx from "clsx";
import { Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function AuthInput({
  label,
  error,
  className,
  ...inputProps
}: AuthInputProps) {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <TextInput
        {...inputProps}
        accessibilityLabel={inputProps.accessibilityLabel ?? label}
        className={clsx("auth-input", error && "auth-input-error", className)}
        placeholderTextColor="#827d6e"
      />
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
}
