import { Link, Stack } from "expo-router";
import { Text } from "react-native";
import React from "react";
import { usePathname } from "expo-router";

export default function NotFoundScreen() {
  const router=usePathname()
  console.log(router)
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
