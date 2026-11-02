import ListHeading from "@/component/ListHeading";
import SubcriptionCard from "@/component/SubcriptionCard";
import UpcomingSubscriptionCard from "@/component/UpCommingSubscriptionCard";
import {
  HOME_BALANCE,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import CreateSubscriptionModal from "@/component/CreateSubscriptionModal";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { useUser } from "@clerk/expo";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const {
    subscriptions,
    isLoaded,
    loadError,
    addSubscription,
  } = useSubscriptions();
  const [expandedSubcriptionId, setExpandedSubcriptionId] = useState<string | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const userName =
    user?.fullName || user?.firstName || user?.username || "there";

  const listHeader = (
    <>
      <View className="home-header">
        <View className="home-user">
          <Image
            source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            className="home-avatar"
          />
          <Text className="home-user-name">{userName}</Text>
        </View>
        <Pressable
          accessibilityLabel="Create subscription"
          accessibilityRole="button"
          className="home-add-button"
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Image source={icons.add} className="home-add-icon" />
        </Pressable>
      </View>
      {loadError ? (
        <Text className="auth-error">
          Could not load saved subscriptions: {loadError}
        </Text>
      ) : null}
      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>
        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>
          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.nextRenewalDate).format("DD MMM YYYY")}
          </Text>
        </View>
      </View>

      <View className="mb-5">
        <ListHeading title="UpComing" />
        <FlatList
          contentContainerStyle={{ paddingRight: 16 }}
          data={UPCOMING_SUBSCRIPTIONS}
          renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="w-4" />}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">No upcoming subscriptions</Text>
          }
        />
      </View>

      <ListHeading title="All Subscriptions" />
    </>
  );

  return (
    <SafeAreaView className="flex-1 p-5">
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubcriptionCard
            {...item}
            expanded={expandedSubcriptionId === item.id}
            onPress={() =>
              setExpandedSubcriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        extraData={expandedSubcriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet</Text>
        }
      />
      <CreateSubscriptionModal
        isReady={isLoaded && !loadError}
        loadError={loadError}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={addSubscription}
        onCreated={setExpandedSubcriptionId}
        visible={isCreateModalVisible}
      />
    </SafeAreaView>
  );
}
