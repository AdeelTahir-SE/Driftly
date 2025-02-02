/* eslint-disable prettier/prettier */
import RideCard from "@/components/rideCard";
import { FlatList, Text, View, Image, ActivityIndicator, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useFetch } from "@/lib/fetch";
import { router } from "expo-router";

export default function HomeScreen() {
  const { user } = useUser();
  const { data, isLoading }: any =  useFetch(`/api/ride/${user?.id}`);

  return (
    <SafeAreaView className="flex justify-center items-center">
      <View className="flex-row justify-between items-center p-4 min-w-full bg-black rounded-s-2xl">
        <Text className="text-orange-400 text-2xl font-bold">
          Recent Rides
        </Text>
      </View>
      <FlatList
        data={data?data:[]}
        keyExtractor={(item) => item.ride_id}
        renderItem={({ item }) => {
          return (
            <RideCard
              longitude={item.origin_longitude}
              latitude={item.origin_latitude}
              from={item.origin_address}
              to={item.destination_address}
              date={item.created_at}
              time={item.ride_time}
              drivername={item.driver.first_name}
              price={item.fare_price}
              carSeats={item.driver.car_seats}
            />
          );
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-col justify-center items-center h-32">
              <ActivityIndicator size="large" color="#f97316"  className="mt-12 "/>
              <Text className="text-orange-500 text-xl font-bold mt-2">Loading...</Text>
            </View>
          ) : (
            <View className="flex-col justify-center items-center h-72 bg-gray-100 rounded-lg p-6 mt-12">
              <Image
                source={require("@/assets/images/search.png")}
                className="w-40 h-40 rounded-lg"
                resizeMode="contain"
              />
              <Text className="text-gray-700 text-lg font-semibold mt-4">No Recent Rides Found</Text>
              <Text className="text-gray-500 text-base mt-1">Book a ride now</Text>
              <TouchableOpacity 
                onPress={() => router.push("/")}
                className="mt-4 bg-orange-500 px-6 py-2 rounded-lg shadow-md"
              >
                <Text className="text-white text-lg font-semibold">Book a Ride</Text>
              </TouchableOpacity>
            </View>
          )
        }
        
      />
    </SafeAreaView>
  );
}
