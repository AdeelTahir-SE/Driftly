import { View, Text, TouchableOpacity, FlatList, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useState } from "react";
import BoardingItem from "@/components/onBoardingItem";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; 

const data = [
  {
    imageurl: require("@/assets/images/onBoarding1.png"),
    title: "Welcome to Driftly",
    subtitle: "Your ride, anytime, anywhere. Fast and reliable transportation at your fingertips.",
  },
  {
    imageurl: require("@/assets/images/onBoarding2.png"),
    title: "Easy Ride Booking",
    subtitle: "Choose your destination, pick a car, and get moving with just a few taps.",
  },
  {
    imageurl: require("@/assets/images/onBoarding3.png"),
    title: "Safe and Secure",
    subtitle: "Enjoy a safe ride with trusted drivers and real-time tracking for peace of mind.",
  },
];

const Welcome = () => {
  const navigation = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleNextPress = () => {
    if (currentIndex < data.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.replace("./signUp");
    }
  };

  return (
    <LinearGradient colors={["#FFA500","#1e293b", "#111827"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="absolute top-14 right-6 z-10">
          <TouchableOpacity
            onPress={() => navigation.replace("./signUp")}
            className="bg-orange-500 px-4 py-2 rounded-full shadow-lg"
          >
            <Text className="text-white text-lg font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <View className="w-screen flex-1 justify-center items-center px-6">
              <BoardingItem imageSource={item.imageurl} title={item.title} subTitle={item.subtitle} />
            </View>
          )}
        />

        <View className="flex-row absolute bottom-32 self-center">
          {data.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <Animated.View
                key={index}
                className={`h-3 mx-1 rounded-full transition-all ${
                  isActive ? "bg-orange-500 w-6" : "bg-gray-400 w-3"
                }`}
              />
            );
          })}
        </View>

        <TouchableOpacity
          className={"self-center w-3/4 absolute bottom-10 z-10 p-4 rounded-full shadow-lg bg-orange-500"}
          onPress={handleNextPress}
        >
          <Text className="text-white text-lg font-semibold text-center">
            {currentIndex === data.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Welcome;
