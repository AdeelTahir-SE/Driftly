/* eslint-disable prettier/prettier */
import { Text, View, Image, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex justify-center items-center">
     <Text>Hello</Text>
     <MapView provider={PROVIDER_DEFAULT} className="w-full h-full min-w-full min-h-72 border-2 rounded-2xl">
      <Text>Hello</Text>
     </MapView>
     <Text>Hello</Text>

    </SafeAreaView>
  );
}
