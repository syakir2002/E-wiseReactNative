import AuthInput from "@/component/AuthInput";
import type { NewSubscriptionInput } from "@/context/SubscriptionsContext";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CreateSubscriptionModalProps {
  visible: boolean;
  isReady: boolean;
  loadError: string | null;
  onClose: () => void;
  onCreate: (input: NewSubscriptionInput) => Promise<Subscription>;
  onCreated: (id: string) => void;
}

const BILLING_OPTIONS = ["Monthly", "Yearly"] as const;
const CATEGORY_OPTIONS = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Other",
] as const;
type BillingOption = (typeof BILLING_OPTIONS)[number];
type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

export default function CreateSubscriptionModal({
  visible,
  isReady,
  loadError,
  onClose,
  onCreate,
  onCreated,
}: CreateSubscriptionModalProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryOption>("Other");
  const [price, setPrice] = useState("");
  const [billing, setBilling] = useState<BillingOption>("Monthly");
  const [validationError, setValidationError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setName("");
    setCategory("Other");
    setPrice("");
    setBilling("Monthly");
    setValidationError("");
    setSubmitError("");
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleCreate() {
    const parsedPrice = Number(price.trim().replace(",", "."));

    if (!name.trim()) {
      setValidationError("Enter a subscription name.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setValidationError("Enter a price greater than zero.");
      return;
    }

    setValidationError("");
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const subscription = await onCreate({
        name: name.trim(),
        category,
        price: parsedPrice,
        billing,
      });

      onCreated(subscription.id);
      resetForm();
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to create the subscription. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View className="modal-overlay">
        <Pressable
          accessibilityLabel="Close new subscription form"
          accessibilityRole="button"
          className="absolute inset-0"
          onPress={handleClose}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          pointerEvents="box-none"
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View
            className="modal-container"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable
                accessibilityLabel="Close new subscription form"
                accessibilityRole="button"
                className="modal-close"
                disabled={isSubmitting}
                onPress={handleClose}
              >
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={{ gap: 16, padding: 20 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <AuthInput
                autoCapitalize="words"
                label="Name"
                onChangeText={setName}
                placeholder="e.g. Spotify"
                returnKeyType="next"
                value={name}
              />
              <AuthInput
                keyboardType="decimal-pad"
                label="Price"
                onChangeText={setPrice}
                placeholder="5.99"
                returnKeyType="done"
                value={price}
              />

              <View className="gap-1.5">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {BILLING_OPTIONS.map((option) => {
                    const isSelected = billing === option;

                    return (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isSelected }}
                        className={`picker-option ${isSelected ? "picker-option-active" : ""}`}
                        key={option}
                        onPress={() => setBilling(option)}
                      >
                        <Text
                          className={`picker-option-text ${isSelected ? "picker-option-text-active" : ""}`}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="gap-1.5">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORY_OPTIONS.map((option) => {
                    const isSelected = category === option;

                    return (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isSelected }}
                        className={`category-chip ${isSelected ? "category-chip-active" : ""}`}
                        key={option}
                        onPress={() => setCategory(option)}
                      >
                        <Text
                          className={`category-chip-text ${isSelected ? "category-chip-text-active" : ""}`}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {validationError || submitError || loadError ? (
                <Text className="auth-error">
                  {loadError ?? submitError ?? validationError}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled: !isReady || isSubmitting,
                }}
                className={`auth-button ${!isReady || isSubmitting ? "auth-button-disabled" : ""}`}
                disabled={!isReady || isSubmitting}
                onPress={handleCreate}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="auth-button-text">Create Subscription</Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
