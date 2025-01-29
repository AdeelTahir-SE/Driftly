/* eslint-disable prettier/prettier */
import { Image, Text, View } from "react-native";

export function formatTime(minutes: number): string {
  const formattedMinutes = +minutes?.toFixed(0) || 0;

  if (formattedMinutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(formattedMinutes / 60);
    const remainingMinutes = formattedMinutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day < 10 ? "0" + day : day} ${month} ${year}`;
}

type RideCardProps = {
  from: string;
  to: string;
  date: string;
  time: number;
  longitude: string;
  latitude: string;
  drivername: string;
  price: string;
  carSeats: number;
};

export default function RideCard({
  from,
  to,
  date,
  time,
  drivername,
  longitude,
  latitude,
  price,
  carSeats,
}: RideCardProps) {
  return (
    <View className="flex-col p-4 bg-white shadow-md rounded-lg border border-gray-300">
      <View className="flex-row  items-center">
        <Image
          source={{
            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${longitude},${latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEO_LOC_IMG_API_KEY}`,
          }}
          className="w-[180px] h-[120px] rounded-lg border border-gray-300 ml-2 "
        />
        <View className="flex-col ">
          <View className="flex-row items-center gap-2">
            <View className="w-10 ml-2 h-10 bg-orange-600 rounded-full flex items-center justify-center">
              <Image
                source={require("@/assets/images/from.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>

            <Text className="text-lg font-semibold text-gray-800">{from}</Text>
          </View>
          <View className="flex-row items-center  gap-2 mt-2">
            <View className="w-10 ml-2 h-10 bg-orange-600 rounded-full flex items-center justify-center">
              <Image
                source={require("@/assets/images/rides.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>
            <Text className="text-lg font-semibold text-gray-800">{to}</Text>
          </View>
        </View>
      </View>

      {/* Details Section */}
      <View className="mt-4 p-8 bg-gray-100 rounded-lg mr-10 ">
        <View className="flex-row justify-between pb-2 border-b border-gray-300">
          <Text className="text-lg font-semibold text-gray-700">
            Date & Time
          </Text>
          <Text className="text-lg font-semibold text-orange-600">
            {formatDate(date)},{formatTime(time)}
          </Text>
        </View>
        <View className="flex-row justify-between py-2 border-b border-gray-300">
          <Text className="text-lg font-semibold text-gray-700">Driver</Text>
          <Text className="text-lg font-semibold text-orange-600">
            {drivername}
          </Text>
        </View>
        <View className="flex-row justify-between py-2 border-b border-gray-300">
          <Text className="text-lg font-semibold text-gray-700">Price</Text>
          <Text className="text-lg font-semibold text-orange-600">{price}</Text>
        </View>
        <View className="flex-row justify-between pt-2">
          <Text className="text-lg font-semibold text-gray-700">Car Seats</Text>
          <Text className="text-lg font-semibold text-orange-600">
            {carSeats}
          </Text>
        </View>
      </View>
    </View>
  );
}
