import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import FormField from "@/components/formField";
import { useRouter, Link } from "expo-router";

const SignUp = () => {
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#000000", "#000000", "#FFB502", "#FFA500"]}
      className="flex-col min-h-full h-full"
    >
      <View className="w-full h-1/3 relative">
        <ImageBackground
          source={require("@/assets/images/onBoarding3.png")}
          className="w-full h-full justify-center items-center"
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
            className="bottom-0 w-full "
          />
        </ImageBackground>
      </View>

      <ScrollView className="flex-1 px-6 mt-8 space-y-4">
        <FormField
          inputType="name"
          icon={require("@/assets/images/name.png")}
        />
        <FormField
          inputType="email"
          icon={require("@/assets/images/Email.png")}
        />
        <FormField inputType="password" icon={undefined} />
        <TouchableOpacity
          className="flex justify-center items-center bg-orange-500 text-white p-4 rounded-xl"
          onPress={() => router.push("../home")}
        >
          <Text className="text-white  ">Sign Up</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-white text-base">
            Have an account already?
          </Text>
          <Link href="/(auth)/signIn" >
            <Text className="font-semibold"> Sign In</Text>
          </Link>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUp;
