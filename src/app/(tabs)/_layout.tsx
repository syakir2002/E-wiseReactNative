import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";

const tabBar = components.tabBar;

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  const TabIcon = ({ focused, icon }: TabIconProps) => (
    <View
      style={{
        width: tabBar.iconFrame * 2,
        height: tabBar.iconFrame + 16,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: tabBar.iconFrame * 2 - 4,
          height: tabBar.iconFrame + 8,
          borderRadius: (tabBar.iconFrame + 8) / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? colors.accent : "transparent",
        }}
      >
        <Image
          source={icon}
          resizeMode="contain"
          style={{ width: tabBar.iconFrame, height: tabBar.iconFrame }}
        />
      </View>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.itemPaddingVertical,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame * 2,
          height: tabBar.iconFrame + 16,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
