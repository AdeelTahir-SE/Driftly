import { TextInput, View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { ImageSourcePropType } from "react-native";

type FormFieldProps = {
  inputType: string;
  icon?: ImageSourcePropType;
};

export default function FormField({ inputType, icon }: FormFieldProps) {
  const [text, setText] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = inputType.toLowerCase() === "password";

  return (
    <View className="py-2">
      {/* Label */}
      <Text className="text-white font-bold text-lg mb-2 capitalize">
        {inputType}
      </Text>

      {/* Input Field */}
      <View className="flex-row items-center border-2 border-gray-300 rounded-lg px-4 py-3 bg-white">
        {/* Left Icon */}
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
          onChangeText={setText}
          value={text}
          placeholder={`Enter your ${inputType}`}
          placeholderTextColor="gray"
          secureTextEntry={isPasswordField && !isPasswordVisible}
        />

        {/* Right Icon (Eye Icon for Password) */}
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
