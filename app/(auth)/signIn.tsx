import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSignIn } from '@clerk/clerk-expo'
import { useClerk } from "@clerk/clerk-expo";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import FormField from "@/components/formField";
import { useRouter, Link } from "expo-router";
import { useState } from "react";
const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const{signOut}=useClerk()
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();


  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return
  await signOut()
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password:form.password,
      })


      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace("../home")      } 
        else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, form.email,form.password])


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
          <Text className="text-white text-2xl font-bold">Sign Up</Text>
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
            className="bottom-0 w-full "
          />
        </ImageBackground>
      </View>

      <ScrollView className="flex-1 px-6 mt-8 space-y-4">
        <FormField
          inputType="email"
          onChangeText={(text) => setForm({ ...form, email: text })}
          text={form.email}
          icon={require("@/assets/images/Email.png")}
        />
        <FormField
          inputType="password"
          icon={undefined}
          onChangeText={(text) => setForm({ ...form, password: text })}
          text={form.password}
        />
        <TouchableOpacity
          className="flex justify-center items-center bg-orange-500 text-white p-4 rounded-xl"
          onPress={onSignInPress}
        >
          <Text className="text-white  ">Sign In</Text>
        </TouchableOpacity>
        <View className="flex-row justify-center mt-4">
          <Text className="text-white text-base">Do not have an account? </Text>
          <Link href="/(auth)/signUp">
            <Text className=" font-semibold"> Register</Text>
          </Link>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignIn;
