import { Text, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text>Settings</Text>
    </SafeAreaView>
  );
};

export default Settings;
