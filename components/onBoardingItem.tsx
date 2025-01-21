import { View, Text } from "react-native";
import { Image } from "react-native";

type props = {
  imageSource: any;
  title: string;
  subTitle: string;
};
export default function BoardingItem(props: props) {
  const { imageSource, title, subTitle } = props;
  return (
    <View className="flex flex-col items-center justify-center ">
      <Image source={imageSource} resizeMode="contain" />
      <Text className="text-3xl text-center font-bold">{title}</Text>
      <Text className="text-center text-xl font-semibold">{subTitle}</Text>
    </View>
  );
}
