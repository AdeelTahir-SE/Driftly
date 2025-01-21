import { Link, Stack } from "expo-router";
import { Text } from "react-native";
import React from "react";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Text>This screen doesn't exist.</Text>
      <Link href="/">
        <Text>Go to home screen!</Text>
      </Link>
    </>
  );
}
