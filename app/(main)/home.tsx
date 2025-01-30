/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
import 'react-native-get-random-values';
import React, { useState, useEffect } from "react";
import { View, Image, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDriverStore, useLocationStore } from "@/store";
import { generateMarkersFromData, calculateRegion } from "@/lib/map";
import { MarkerData } from "@/types/type";
import { router } from 'expo-router';

const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function HomeScreen() {
  const setUserLocation = useLocationStore((state) => state.setUserLocation);
  const userLatitude = useLocationStore((state) => state.userLatitude);
  const userLongitude = useLocationStore((state) => state.userLongitude);
  const destinationLatitude = useLocationStore((state) => state.destinationLatitude);
  const destinationLongitude = useLocationStore((state) => state.destinationLongitude);
  const setDestLocation = useLocationStore((state) => state.setDestLocation);
  
  const selectedDriver = useDriverStore((state) => state.selectedDriver);
  const setDrivers = useDriverStore((state) => state.setDrivers);
  const drivers = useDriverStore((state) => state.drivers);

  const [hasPermission, setHasPermission] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required for this app.");
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
        address[0]?.street || "Unknown",
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
        profile_image_url: "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
        car_image_url: "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
        car_seats: 4,
        rating: 4.8,
      },
      {
        id: 2,
        first_name: "David",
        last_name: "Brown",
        profile_image_url: "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
        car_image_url: "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
        car_seats: 5,
        rating: 4.6,
      },
      {
        id: 3,
        first_name: "David",
        last_name: "Brown",
        profile_image_url: "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
        car_image_url: "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
        car_seats: 5,
        rating: 4.6,
      },
      {
        id: 4,
        first_name: "David",
        last_name: "Brown",
        profile_image_url: "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
        car_image_url: "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
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
    console.log(newMarkers);
  }, [userLatitude, userLongitude, drivers]);

  return (
    <View className="flex-1">
      <MapView
        provider={PROVIDER_GOOGLE}
        userInterfaceStyle="light"
        style={
          {
            width: "100%",
            height: "60%",

          }
        }
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
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description='driver'
            identifier='driver'
            style={{
              width: "30%",
              height: "30%",
            }}
            image={
              marker.id === selectedDriver?.driver_id
                ? require("@/assets/images/selected-marker.png")
                : require("@/assets/images/marker.png")
            }
            pinColor={marker.id === selectedDriver?.driver_id ? "blue" : "red"}
          />
        ))}
      </MapView>

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
              setDestLocation(data.description, details.geometry.location.lat, details.geometry.location.lng);
              console.log(data.description, details.geometry.location.lat, details.geometry.location.lng);
              setMarkers(prevMarkers => prevMarkers.map(marker => marker.id === selectedDriver?.driver_id ? { ...marker, selected: false } : marker));
              router.push("/(main)/book-ride");
            }
          }}
          query={{
            key: googleApiKey,
            language: "en",
          }}
          renderLeftButton={() => (
            <View className="flex items-center justify-center w-8 h-8">
              <Image source={require("@/assets/images/search.png")} className="w-6 h-6" resizeMode="contain" />
            </View>
          )}
          textInputProps={{
            placeholderTextColor: "gray",
          }}
        />
      </View>
    </View>
  );
}
