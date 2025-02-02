import "react-native-get-random-values";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDriverStore, useLocationStore } from "@/store";
import {
  generateMarkersFromData,
  calculateRegion,
  calculateDriverTimes,
} from "@/lib/map";
import { MarkerData } from "@/types/type";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlatList } from "react-native";
import DriverCard from "@/components/driversOffer";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import MapViewDirections from "react-native-maps-directions";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import ReactNativeModal from "react-native-modal";

const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;



export default function HomeScreen() {
  const user: any = useUser();
  const setUserLocation = useLocationStore((state) => state.setUserLocation);
  const userAddress = useLocationStore((state) => state.userAddress);
  const destAddress = useLocationStore((state) => state.destAddress);
  const userLatitude = useLocationStore((state) => state.userLatitude);
  const userLongitude = useLocationStore((state) => state.userLongitude);
  const [verifiedDriver, setVerifiedDriver] = useState(false);
  const destinationLatitude = useLocationStore((state) => state.destLatitude);
  const destinationLongitude = useLocationStore((state) => state.destLongitude);
  const setDestLocation = useLocationStore((state) => state.setDestLocation);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const selectedDriver = useDriverStore((state) => state.selectedDriver);
  const setSelectedDriver = useDriverStore((state) => state.setSelectedDriver);
  const setDrivers = useDriverStore((state) => state.setDrivers);
  const drivers = useDriverStore((state) => state.drivers);

  const [hasPermission, setHasPermission] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const confirmHandler = async (paymentMethod, _, intentCreationCallback) => {
    const response = await fetch(`/(api)/(stripe)/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name:
          user?.fullName ||
          user?.emailAddresses[0]?.emailAddress.split("@")[0]!,
        amount: selectedDriver?.price!,
        paymentMethodId: paymentMethod?.id!,
      }),
    });
    const { paymentIntent, customer } = await response.json();

    if (paymentIntent.client_secret) {
      const response = await fetch(`/(api)/(stripe)/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          paymentMethodId: paymentMethod.id,
          customerId: customer,
        }),
      });
      if (paymentIntent.client_secret) {
        const response = await fetch("/(api)/ride/create", {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            origin_address: userAddress,
            destination_address: destAddress,
            origin_latitude: userLatitude,
            origin_longitude: userLongitude,
            destination_latitude: destinationLatitude,
            destination_longitude: destinationLongitude,
            ride_time: Date.now(),
            fare_price: (Math.random() + 1) * 100 * 100,
            payment_status: "paid",
            driver_id: selectedDriver?.id,
            user_id: user?.id,
          }),
        });
      }
      intentCreationCallback({
        clientSecret: paymentIntent.client_secret,
      });
    }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Driftly",
      intentConfiguration: {
        mode: {
          amount: selectedDriver?.price || 12 * 100,
          currencyCode: "usd",
        },
        confirmHandler: confirmHandler,
      },
      defaultBillingDetails: {
        name: "Driftly",
      },
    });
    console.log(error);
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    console.log("openPaymentSheet");
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();
    setLoading(false);
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

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
    console.log(
      "asas",
      userLatitude,
      userLongitude,
      destinationLatitude,
      destinationLongitude
    );
    async function fetchDriversTimes(
      markers: MarkerData[],
      userLatitude: number,
      userLongitude: number,
      destinationLatitude: number,
      destinationLongitude: number
    ) {
      if (markers.length > 0 && destinationLatitude && destinationLongitude) {
        const driverTimes = await calculateDriverTimes({
          markers,
          userLatitude,
          userLongitude,
          destinationLatitude,
          destinationLongitude,
        });
        setDrivers(driverTimes);
      }
    }
    fetchDriversTimes(
      markers,
      userLatitude,
      userLongitude,
      destinationLatitude,
      destinationLongitude
    );
  }, [destinationLatitude, destinationLongitude]);

  useEffect(() => {
    async function fetchDrivers() {
      const data = await fetch("/(api)/driver", {
        method: "GET",
        headers: {
          "Content-type": "Application/json",
        },
      });
      const res = await data.json();
      if (res.success) {
        setDrivers(res.data);
      }
    }
    fetchDrivers();
    if (!userLatitude || !userLongitude || drivers.length === 0) return;
    const newMarkers = generateMarkersFromData({
      data: drivers,
      userLatitude,
      userLongitude,
    });

    setMarkers(newMarkers);
  }, [userLatitude, userLongitude]);

  if (!markers?.length||!userLatitude||!userLongitude)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Loading..</Text>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  return (
    <View className="flex-1">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          userInterfaceStyle="light"
          initialCamera={{
            pitch: 0,
            heading: 0,
            zoom: 15,
            center: {
              latitude: userLatitude,
              longitude: userLongitude,
            },
          }}
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
              description={
                marker.id === selectedDriver?.id ? "Selected Driver" : "Driver"
              }
              identifier="driver"
              image={
                marker.id === selectedDriver?.id
                  ? require("@/assets/images/selected-marker.png")
                  : require("@/assets/images/marker.png")
              }
              pinColor={marker.id === selectedDriver?.id ? "blue" : "red"}
            />
          ))}
          {destinationLatitude && destinationLongitude && (
            <>
             <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            style={{width: 20, height: 20}}
            title="Destination"
            image={require("@/assets/images/pin.png")}
          />
              <MapViewDirections
                origin={{ latitude: userLatitude, longitude: userLongitude }} // San Francisco
                destination={{ latitude: destinationLatitude, longitude: destinationLongitude }} // Los Angeles
                apikey={googleApiKey!}
                strokeWidth={3}
                strokeColor="blue"
              />
            </>
          )}
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

                console.log(
                  "asas",
                  userLatitude,
                  userLongitude,
                  destinationLatitude,
                  destinationLongitude
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
                  publishableKey={
                    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!
                  }
                  merchantIdentifier="merchant.driftly.com"
                  y
                  urlScheme="myapp" // required for 3D Secure and bank redirects
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
                        disabled={loading}
                        onPress={openPaymentSheet}
                        className={`px-6 py-3 rounded-lg shadow-lg 
              ${loading ? "bg-gray-400" : "bg-orange-500 active:bg-orange-600"}`}
                      >
                        <Text className="text-white font-semibold text-lg">
                          {loading ? "Processing..." : "Confirm Ride"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ReactNativeModal
                      isVisible={success}
                      onBackdropPress={() => setSuccess(false)}
                    >
                      <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
                        <Image
                          source={require("@/assets/images/check.png")}
                          className="w-28 h-28 mt-5"
                        />

                        <Text className="text-2xl text-center font-JakartaBold mt-5">
                          Ride Confirmed
                        </Text>

                        <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
                          Thank you for your booking. Your reservation has been
                          successfully placed. Please proceed with your trip.
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            setSuccess(false);
                            router.push("/(main)/home");
                          }}
                          className="mt-5"
                        >
                          <Text>Back Home</Text>
                        </TouchableOpacity>
                      </View>
                    </ReactNativeModal>
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
