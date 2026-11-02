import SubscriptionCard from "@/component/SubcriptionCard";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const { subscriptions, loadError } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const filteredSubscriptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return subscriptions;
    }

    return subscriptions.filter((subscription) =>
      [
        subscription.name,
        subscription.plan,
        subscription.category,
        subscription.paymentMethod,
        subscription.status,
        subscription.billing,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [searchQuery, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="mb-5">
          <Text className="text-3xl font-sans-bold text-primary">
            Subscriptions
          </Text>
          {loadError ? (
            <Text className="mt-2 text-sm text-destructive">
              Could not load saved subscriptions: {loadError}
            </Text>
          ) : null}
          <TextInput
            accessibilityLabel="Search subscriptions"
            autoCapitalize="none"
            autoCorrect={false}
            className="mt-5 h-12 rounded-xl border border-border bg-card px-4 text-base text-primary"
            onChangeText={setSearchQuery}
            placeholder="Search subscriptions"
            placeholderTextColor="#827d6e"
            returnKeyType="search"
            value={searchQuery}
          />
        </View>

        <FlatList
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
          data={filteredSubscriptions}
          extraData={expandedSubscriptionId}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-4" />}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() =>
                setExpandedSubscriptionId((currentId) =>
                  currentId === item.id ? null : item.id,
                )
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">
              {searchQuery.trim()
                ? `No subscriptions found for "${searchQuery.trim()}".`
                : "No subscriptions yet"}
            </Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Subscriptions;
