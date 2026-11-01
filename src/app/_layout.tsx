import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import "../../global.css";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("../../assets/fonts/PlusJakartaSanas-Regular.ttf"),
    "sans-bold": require("../../assets/fonts/PlusJakartaSanas-Bold.ttf"),
    "sans-semibold": require("../../assets/fonts/PlusJakartaSanas-SemiBold.ttf"),
    "sans-medium": require("../../assets/fonts/PlusJakartaSanas-Medium.ttf"),
    "sans-extrabold": require("../../assets/fonts/PlusJakartaSanas-ExtraBold.ttf"),
    "sans-light": require("../../assets/fonts/PlusJakartaSanas-Light.ttf"),
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
