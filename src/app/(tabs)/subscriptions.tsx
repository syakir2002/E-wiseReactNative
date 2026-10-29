import { Text, View } from "react-native";
import React from "react";
import {Link, useLocalSearchParams} from "expo-router";
    

const Subscription = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Subscription Details: {id}</Text>
    </View>
  );
};

export default Subscription;
