import { Tabs } from "expo-router";
import { View, Image, Text } from "react-native";
import { styled } from "nativewind";

type TabIconProps = {
  focused: boolean;
  color: string;
  icon: any;
};

const TabIcon = ({ focused, color, icon }: TabIconProps) => {
  return (
    <View
      className={`flex items-center justify-center flex-col rounded-full ${
        focused ? "bg-orange-500 w-14 h-14 p-8" : "w-12 h-12 p-1"
      }`}
    >
      <Image source={icon} resizeMode="contain" className="w-8 h-8" />
      <View className="flex justify-center items-center">
      <Text
        className={` ${
          focused ? "text-white font-bold absolute text-xs" : "text-gray-500"
        }`}
      >
        Home
      </Text>
      </View>
    </View>
  );
};

export default function MainLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#333333",
          height: 70,
          borderRadius: 300,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingTop: 10,
          paddingHorizontal: 20,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} icon={require("@/assets/images/home.png")} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} icon={require("@/assets/images/rides.png")} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} icon={require("@/assets/images/chat.png")} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} icon={require("@/assets/images/profile.png")} />
          ),
        }}
      />
    </Tabs>
  );
}
