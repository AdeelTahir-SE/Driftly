import { SafeAreaView } from "react-native-safe-area-context";
import { Image, View, Text, TextInput, ActivityIndicator } from "react-native";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient"; 


export default function HomeScreen() {
  const { user } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  async function updateProfile(form) {
    const response = await fetchAPI(`/(api)/user`, {
      method: "PUT",
      body: JSON.stringify({...form,userId:user?.id}),
    });
    console.log(response);
  }
  
  useEffect(() => {
    if (user?.id) {
      async function fetchProfile() {
        try {
          const data = await fetchAPI(`/(api)/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            body:JSON.stringify({userId:user?.id})
          });
          setProfileData(data);
          setForm({
            name: data.name,
            password: data.password,
          });
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
      fetchProfile();
    }
  }, [user?.id]);

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={['#000000', '#FFA500']} // Black and Orange gradient
        style={{ flex: 1 }}
      >
        <View className="flex-1 flex-col w-full h-full justify-center items-center">
        <Image
          source={require("@/assets/images/profile.png")}
          className="w-40 h-40 rounded-full mb-6"
        />
        </View>
        <View className="flex-1 justify-center items-center">
          {profileData ? (
            <>
              <View className="mb-6">
                <Text className="text-xl text-white">Email</Text>
                <Text className="text-lg text-white">
                  {user?.emailAddresses[0].emailAddress.split("@")[0]}
                </Text>
              </View>

              <View className="mb-6">
                <Text className="text-xl text-white">Name</Text>
                <TextInput
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                  className="h-10 w-64 border border-white rounded-md text-white px-4 py-2 text-lg"
                />
              </View>

              <View className="mb-6">
                <Text className="text-xl text-white">Password</Text>
                <TextInput
                  value={form.password}
                  onChangeText={(text) => setForm({ ...form, password: text })}
                  className="h-10 w-64 border border-white rounded-md text-white px-4 py-2 text-lg"
                  secureTextEntry={true}
                />
              </View>

              <View className="mb-6">
                <Text
                  onPress={() => updateProfile(form)}
                  className="bg-black text-orange-500 py-2 px-4 rounded-full text-lg font-bold"
                >
                  Update Profile
                </Text>
              </View>
            </>
          ) : (
            <View className="flex justify-center items-center">
              <ActivityIndicator color="#FFA500" />
              <Text className="text-xl text-white">Loading...</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
