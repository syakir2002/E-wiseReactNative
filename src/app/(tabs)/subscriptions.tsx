import { Text, View } from "react-native";
import React from "react";
import {Link, useLocalSearchParams} from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
    

const Subscription = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text>Subscription Details: {id}</Text>
    </SafeAreaView>
  );
};

export default Subscription;
