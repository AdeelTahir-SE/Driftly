import { Tabs } from "expo-router";
import { View, Image, Text } from "react-native";

type TabIconProps = {
  focused: boolean;
  color: string;
  icon: any;
  title:string
};

const TabIcon = ({ focused, color, icon,title}: TabIconProps) => {
  return (
    <View
      className={`flex items-center justify-center flex-col rounded-full ${
        focused ? "bg-orange-500 w-16 h-16 p-8" : "w-14 h-14 p-1"
      }`}
    >
      <Image source={icon} resizeMode="contain" className="w-8 h-8" />
      <Text
        className={` ${
          focused ? "flex-none " : "text-gray-500"
        }`}
      >
        {title}
      </Text>
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
          alignItems: "start",
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
            <TabIcon focused={focused} color={color} icon={require("@/assets/images/home.png")} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} icon={require("@/assets/images/rides.png")} title="Ride" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} icon={require("@/assets/images/chat.png")} title="Chat"/>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color} icon={require("@/assets/images/profile.png")} title="Profile"/>
          ),
        }}
      />
    </Tabs>
  );
}
