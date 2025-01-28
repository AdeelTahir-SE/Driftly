import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function HomeScreen() {
  const { user } = useUser()

  return (
    <SafeAreaView className='flex justify-center items-center'>
      <SignedIn>
        <Text className='text-4xl'>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/signIn">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/signUp">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>
  )
}