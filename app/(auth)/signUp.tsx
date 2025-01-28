import {
  View,
  Image,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React from "react";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import FormField from "@/components/formField";
import { useRouter, Link } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
const [showSuccessModal,setShowSuccessmodal]=useState(false);
  const [form, setForm] = useState({
    name: "",
    emailAddress: "",
    password: "",
    code: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    code: "",
    error: "",
  });
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.emailAddress,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({ ...verification, state: "pending" });
    } catch (err:any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          state: "failed",
          error: "Invalid code",
        });
        Alert.alert("Error", "Invalid code");
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: "failed",
        error: err.errors[0].longMessage,
      });
    }
  };
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
          onChangeText={(text) => setForm({ ...form, name: text })}
          text={form.name}
          icon={require("@/assets/images/name.png")}
        />
        <FormField
          inputType="email"
          onChangeText={(text) => setForm({ ...form, emailAddress: text })}
          text={form.emailAddress}
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
          onPress={onSignUpPress}
        >
          <Text className="text-white  ">Sign Up</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-white text-base">Have an account already?</Text>
          <Link href="/(auth)/signIn">
            <Text className="font-semibold"> Sign In</Text>
          </Link>
        </View>
        <ReactNativeModal isVisible={showSuccessModal}
        >
          <View className="flex-col justify-center items-center mt-4 bg-gray-100 p-12 rounded-lg ">
            <Image
              source={require("@/assets/images/check.png")}
              resizeMode="contain"
              className="w-16 h-16 mix-blend-multiply"
            />
            <Text className="text-orange-500 text-lg font-bold  text-center mt-4">
              Account created successfully
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/")}
              className="bg-orange-500 px-4 py-2 rounded-full shadow-lg mt-4"
            >
              <Text className="text-white text-lg font-semibold">Continue</Text>
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={verification.state === "pending"}
        
        onModalHide={()=>{if(verification.state=="success")setShowSuccessmodal(true)}}>

        
          <View className="flex-col  items-center mt-4 bg-gray-100 p-12 rounded-lg ">
            <Text className="text-orange-500  text-center font-extrabold text-2xl mt-4">
              Verification
            </Text>
            <Text className="text-gray-500 text-lg text-center mt-4">
              A verification code has been sent to your email address. Please
              enter the code below
            </Text>

            <TextInput
              className="text-black text-lg border-2 min-w-full border-gray-300 rounded-lg px-4 py-7"
              onChangeText={(text) => {
                console.log("Typed Text:", text); // Debugging
                setVerification({ ...verification, code: text });
              }}
              value={verification.code}
              placeholder="Enter the code like 2341"
              placeholderTextColor="gray"
              textContentType="oneTimeCode"
              keyboardType="numeric"
            />

            <TouchableOpacity
              onPress={onVerifyPress}
              className="bg-orange-500 px-4 py-2 rounded-full shadow-lg mt-4"
            >
              <Text className="text-white text-lg font-semibold">Verify</Text>
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUp;
