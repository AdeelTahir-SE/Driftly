import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import BoardingItem from "@/components/onBoardingItem";
import { FlatList } from "react-native";
const data = [
  {
    imageurl: require("@/assets/images/onBoarding1.png"),
    title: "Welcome to Driftly",
    subtitle:
      "Your ride, anytime, anywhere. Fast and reliable transportation at your fingertips.",
  },
  {
    imageurl: require("@/assets/images/onBoarding2.png"),
    title: "Easy Ride Booking",
    subtitle:
      "Choose your destination, pick a car, and get moving with just a few taps.",
  },
  {
    imageurl: require("@/assets/images/onBoarding1.png"),
    title: "Safe and Secure",
    subtitle:
      "Enjoy a safe ride with trusted drivers and real-time tracking for peace of mind.",
  },
];

const Welcome = () => {
  return (
    <SafeAreaView className="flex-col items-center justify-center ">


      <FlatList
      className="max-w-screen "
        data={data}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <BoardingItem
            imageSource={item.imageurl}
            title={item.title}
            subTitle={item.subtitle}
          />
        )}
      />
      
    </SafeAreaView>
  );
};

export default Welcome;
