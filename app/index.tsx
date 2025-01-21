import { SafeAreaView } from "react-native";
import { Text } from "react-native";
import { Link } from "expo-router";



export default function OpeningScreen(){
    return (
        <SafeAreaView className="flex items-center justify-center h-full">
            <Link href="/(tabs)"><Text className="text-orange-700">Opening Screen</Text></Link>
        </SafeAreaView>
    )
}