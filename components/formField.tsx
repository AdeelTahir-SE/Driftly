import { TextInput, View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { ImageSourcePropType } from "react-native";

type FormFieldProps = {
  inputType: string;
  icon?: ImageSourcePropType;
  text: string; 
  onChangeText: (text: string) => void; 
};

export default function FormField({ inputType, icon,onChangeText,text }: FormFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = inputType.toLowerCase() === "password";

  return (
    <View className="py-2">
      <Text className="text-white font-bold text-lg mb-2 capitalize">
        {inputType}
      </Text>

      <View className="flex-row items-center border-2 border-gray-300 rounded-lg px-4 py-3 bg-white">
        {icon && (
          <Image
            source={icon}
            className="w-6 h-6 mr-2"
            resizeMode="contain"
            tintColor="black"
          />
        )}

        {/* Text Input */}
        <TextInput
          className="flex-1 text-black text-lg"
          onChangeText={onChangeText}
          value={text}
          placeholder={`Enter your ${inputType}`}
          placeholderTextColor="gray"
          secureTextEntry={isPasswordField && !isPasswordVisible}
        />

        {isPasswordField && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Image
              source={
                isPasswordVisible
                  ? require("@/assets/images/eye-icon.png")
                  : require("@/assets/images/eye-blind-icon.png")
              }
              className="w-6 h-6 ml-2"
              resizeMode="contain"
              tintColor="black"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
