import { View, Text, Image } from "react-native";

type Props = {
  imageSource: any;
  title: string;
  subTitle: string;
};

export default function BoardingItem(props: Props) {
  const { imageSource, title, subTitle } = props;

  return (
    <View className="flex-col justify-center items-center w-screen">
      <Image 
        source={imageSource} 
        resizeMode="contain" 
        className="mb-6 max-w-80 max-h-72" 
      />
      <Text className="text-3xl text-center font-semibold text-black mb-4">
        {title}
      </Text>
      <Text className="text-lg text-center text-gray-700 font-medium w-full max-w-screen flex-wrap">
        {subTitle}
      </Text>
    </View>
  );
}
