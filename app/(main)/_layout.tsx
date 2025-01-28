import { Tabs } from "expo-router";
import { Text, View, Image } from "react-native";

const TabIcon = ({ focused, color, icon }) => {
  return (
    <View className="flex items-center justify-center border-2 min-h-full min-w-10">
      <View className="flex items-center justify-center">
        <Image source={icon} resizeMode="cover" className="w-8 h-8" />
      </View>
      <Text style={{ }}>Home</Text>
    </View>
  );
};

export default function mainLayout() {
  return (
    <Tabs
      screenOptions={{
        initialRouteName: "home",
        tabBarShowLabel: false,
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: "white",

        tabBarStyle: {
          backgroundColor: "#333333",
          height: 60,
          borderRadius: 300,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          overflow: "hidden",
          paddingBottom: 0,
          marginHorizontal: 20,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,

          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              icon={require("@/assets/images/check.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,
          title: "Map",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              icon={require("@/assets/images/check.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              focused={focused}
              color={color}
              icon={require("@/assets/images/check.png")}
            />
          ),
        }}
      />
    </Tabs>
  );
}
