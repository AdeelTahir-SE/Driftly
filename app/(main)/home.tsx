import "react-native-get-random-values";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDriverStore, useLocationStore } from "@/store";
import { generateMarkersFromData, calculateRegion } from "@/lib/map";
import { MarkerData } from "@/types/type";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlatList } from "react-native";
import DriverCard from "@/components/driversOffer";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";

const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function HomeScreen() {
  const router = useRouter();
  const setUserLocation = useLocationStore((state) => state.setUserLocation);
  const userAddress = useLocationStore((state) => state.userAddress);
  const destAddress = useLocationStore((state) => state.destAddress);
  const userLatitude = useLocationStore((state) => state.userLatitude);
  const userLongitude = useLocationStore((state) => state.userLongitude);
  const [verifiedDriver, setVerifiedDriver] = useState(false);
  const destinationLatitude = useLocationStore(
    (state) => state.destinationLatitude
  );
  const destinationLongitude = useLocationStore(
    (state) => state.destinationLongitude
  );
  const setDestLocation = useLocationStore((state) => state.setDestLocation);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const selectedDriver = useDriverStore((state) => state.selectedDriver);
  const setSelectedDriver = useDriverStore((state) => state.setSelectedDriver);
  const setDrivers = useDriverStore((state) => state.setDrivers);
  const drivers = useDriverStore((state) => state.drivers);

  const [hasPermission, setHasPermission] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [publishableKey, setPublishableKey] = useState("");

  const fetchPublishableKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
    setPublishableKey(key);
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is required for this app."
        );
        setHasPermission(false);
        return;
      }
      setHasPermission(true);

      const location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setUserLocation(
        address[0]?.street ||
          address[0]?.name ||
          address[0]?.district ||
          "Your location",
        location.coords.latitude,
        location.coords.longitude
      );
    };

    getLocation();
  }, []);

  useEffect(() => {
    setDrivers([
      {
        id: 1,
        first_name: "James",
        last_name: "Wilson",
        profile_image_url:
          "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
        car_image_url:
          "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
        car_seats: 4,
        rating: 4.8,
      },
      {
        id: 2,
        first_name: "David",
        last_name: "Brown",
        profile_image_url:
          "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
        car_image_url:
          "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
        car_seats: 5,
        rating: 4.6,
      },
    ]);
  }, []);

  useEffect(() => {
    if (!userLatitude || !userLongitude || drivers.length === 0) return;
    const newMarkers = generateMarkersFromData({
      data: drivers,
      userLatitude,
      userLongitude,
    });
    setMarkers(newMarkers);
  }, [userLatitude, userLongitude, drivers]);

  console.log(userAddress, destAddress);

  return (
    <View className="flex-1">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          userInterfaceStyle="light"
          style={{
            width: "100%",
            height: "60%",
          }}
          initialRegion={calculateRegion({
            userLatitude,
            userLongitude,
            destinationLatitude,
            destinationLongitude,
          })}
          showsUserLocation={hasPermission}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              description="Driver"
              identifier="driver"
              image={
                marker.id === selectedDriver?.id
                  ? require("@/assets/images/selected-marker.png")
                  : require("@/assets/images/marker.png")
              }
              pinColor={marker.id === selectedDriver?.id ? "blue" : "red"}
            />
          ))}
        </MapView>

        {/* Google Places Search */}
        <View className="absolute top-12 left-5 right-5 z-10">
          <GooglePlacesAutocomplete
            fetchDetails
            placeholder="Where do you want to go?"
            debounce={200}
            enablePoweredByContainer={false}
            styles={{
              textInputContainer: {
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                backgroundColor: "white",
                shadowColor: "#d4d4d4",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5,
              },
              textInput: {
                fontSize: 16,
                fontWeight: "600",
                marginTop: 5,
                borderRadius: 50,
                padding: 10,
                width: "100%",
                backgroundColor: "white",
              },
              listView: {
                backgroundColor: "white",
                position: "absolute",
                top: 60,
                left: 0,
                right: 0,
                borderRadius: 10,
                shadowColor: "#d4d4d4",
                zIndex: 999,
              },
            }}
            onPress={(data, details = null) => {
              if (details) {
                setDestLocation(
                  data.description,
                  details.geometry.location.lat,
                  details.geometry.location.lng
                );
                setBottomSheetVisible(true);
              }
            }}
            query={{
              key: googleApiKey,
              language: "en",
            }}
            textInputProps={{
              placeholderTextColor: "gray",
            }}
          />
        </View>

        {bottomSheetVisible && (
          <BottomSheet
            snapPoints={["40%", "70%"]}
            enablePanDownToClose={true}
            onClose={() => setBottomSheetVisible(false)}
          >
            <BottomSheetScrollView className="bg-white flex-1 p-4">
              {!verifiedDriver ? (
                <FlatList
                  data={drivers}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <DriverCard
                      item={item}
                      selected={selectedDriver?.id}
                      setSelected={() => setSelectedDriver(item)}
                    />
                  )}
                  ListFooterComponent={
                    <View className="h-14 flex items-center justify-center mt-4">
                      <TouchableOpacity
                        onPress={() => setVerifiedDriver(true)}
                        className="bg-orange-500 px-6 py-3 rounded-lg shadow-lg active:bg-orange-600"
                      >
                        <Text className="text-white font-semibold text-lg">
                          Select Driver
                        </Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
              ) : (
                <StripeProvider
                  publishableKey={publishableKey}
                  merchantIdentifier="merchant.identifier" // required for Apple Pay
                  urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
                >
                  <View className="bg-white p-6 rounded-lg shadow-lg">
                    <View className="items-center flex-row gap-4 mb-4">
                      <View className="flex-row justify-between items-center bg-orange-500 p-3 rounded-full max-w-[100px] w-18 m-4 shadow-md">
                        <TouchableOpacity
                          onPress={() => setVerifiedDriver(false)}
                          className="px-2 "
                        >
                          <Text className="text-white text-lg font-bold">
                            Back
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Text className="text-orange-500 text-xl font-bold">
                        Rider Information
                      </Text>
                    </View>

                    {/* Rider Profile */}
                    <View className="flex-row items-center space-x-4">
                      <Image
                        source={{ uri: selectedDriver?.profile_image_url }}
                        className="w-16 h-16 rounded-full border-2 border-orange-500"
                      />
                      <Text className="text-gray-800 text-lg font-semibold">
                        {selectedDriver?.first_name} {selectedDriver?.last_name}
                      </Text>
                    </View>

                    {/* Ride Details */}
                    <View className="mt-4 flex-row justify-between">
                      <View className="items-center">
                        <Text className="text-gray-600 text-sm">
                          Ride Price
                        </Text>
                        <Text className="text-gray-800 font-semibold text-lg">
                          $25.00
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-gray-600 text-sm">Ride Time</Text>
                        <Text className="text-gray-800 font-semibold text-lg">
                          15 min
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-gray-600 text-sm">
                          Seats Available
                        </Text>
                        <Text className="text-gray-800 font-semibold text-lg">
                          {selectedDriver?.car_seats}
                        </Text>
                      </View>
                    </View>

                    {/* Car Image */}
                    <View className="items-center mt-6">
                      <Image
                        source={{ uri: selectedDriver?.car_image_url }}
                        className="w-32 h-20 rounded-md"
                      />
                    </View>

                    {/* Location Info */}
                    <View className="mt-4">
                      <Text className="text-gray-600 text-sm">From</Text>
                      <Text className="text-gray-800 font-semibold">
                        {userAddress}
                      </Text>
                    </View>
                    <View className="mt-4">
                      <Text className="text-gray-600 text-sm">To</Text>
                      <Text className="text-gray-800 font-semibold">
                        {destAddress}
                      </Text>
                    </View>

                    <View className="mt-4 flex items-center justify-center">
                      <TouchableOpacity
                        className="bg-orange-500 px-6 py-3 rounded-lg shadow-lg active:bg-orange-600"
                        onPress={() => router.push("/chat")}
                      >
                        <Text className="text-white font-semibold text-lg">
                          Confirm Ride
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </StripeProvider>
              )}
            </BottomSheetScrollView>
          </BottomSheet>
        )}
      </GestureHandlerRootView>
    </View>
  );
}
