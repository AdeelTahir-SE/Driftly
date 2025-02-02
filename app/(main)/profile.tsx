import { SafeAreaView } from "react-native-safe-area-context";
import { Image, View, Text, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const { user } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  async function updateProfile(form) {
    const response = await fetchAPI("/(api)/user", {
      method: "PUT",
      body: JSON.stringify({ ...form, userId: user?.id }),
    });
    console.log(response);
  }

  useEffect(() => {
    if (user?.id) {
      async function fetchProfile() {
        try {
          const data = await fetchAPI(`/(api)/user?userId=${user?.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          setProfileData(data.response);
          setForm({
            name: data.response.name,
            password: data.response.password,
          });
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
      fetchProfile();
    }
  }, [user?.id]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center py-6">
        <Image
          source={require("@/assets/images/profile.png")}
          className="w-40 h-40 rounded-full mb-6"
        />
      </View>

      <View className="flex-1 justify-center items-center bg-white rounded-t-3xl px-6 py-6">
        {profileData ? (
          <>
            <View className="mb-6 w-full">
              <Text className="text-xl text-gray-800">Email</Text>
              <Text className="text-lg text-gray-600">
                {user?.emailAddresses[0].emailAddress.split("@")[0]}
              </Text>
            </View>

            <View className="mb-6 w-full">
              <Text className="text-xl text-gray-800">Name</Text>
              <TextInput
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
                className="h-12 w-full border border-gray-300 rounded-md text-gray-800 px-4 py-2 text-lg"
                placeholder="Enter your name"
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <View className="mb-6 w-full">
              <Text className="text-xl text-gray-800">Password</Text>
              <TextInput
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                className="h-12 w-full border border-gray-300 rounded-md text-gray-800 px-4 py-2 text-lg"
                secureTextEntry={true}
                placeholder="Enter your password"
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <View className="mb-6 w-full">
              <TouchableOpacity
                onPress={() => updateProfile(form)}
                className="bg-orange-600 py-3 rounded-full text-lg font-bold flex justify-center items-center"
              >
                <Text className="text-white">Update Profile</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="flex justify-center items-center">
            <ActivityIndicator color="#FFA500" />
            <Text className="text-xl text-gray-600">Loading...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
