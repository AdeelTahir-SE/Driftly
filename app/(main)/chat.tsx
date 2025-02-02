import { useState, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { useDriverStore } from "@/store";
import { View, Text, Image } from "react-native";

export default function ChatScreen() {
  const selectedDriver = useDriverStore((state) => state.selectedDriver);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedDriver) {
      setMessages([
        {
          _id: 1,
          text: `Hello! How can I assist you today?`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: selectedDriver?.name || "Driver",
          },
        },
      ]);
    }
  }, [selectedDriver]);

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {!selectedDriver ? (
        <View className="flex-1 justify-center items-center">
          <Image source={require("@/assets/images/search.png")} className="w-64 h-64" />
          <Text className="text-gray-700 text-lg font-bold mt-4">
            No driver selected
          </Text>
        </View>
      ) : (
        <>
          <View className="p-4 border-b bg-orange-500 rounded-b-xl border-gray-500 ">
            <Text className="text-white text-lg font-bold text-center">
              Chat with {selectedDriver?.name || "Driver"}
            </Text>
          </View>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{ _id: 1 }}
            placeholder="Type a message..."
            renderBubble={(props) => (
              <Bubble
                {...props}
                wrapperStyle={{
                  left: { backgroundColor: "#FFB74D" }, // Light orange
                  right: { backgroundColor: "#E65100" }, // Dark orange
                }}
                textStyle={{
                  left: { color: "white" },
                  right: { color: "white" },
                }}
              />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}
