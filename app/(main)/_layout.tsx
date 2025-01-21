import { Tabs } from "expo-router";
import { Text } from "react-native";
export default function mainLayout(){
    return (
<Tabs>

    <Tabs.Screen name="home" 
    options={
        {
            headerShown:false,
            title:"Home",
            tabBarIcon:({color,focused})=>(<Text>A</Text>)
        }
        } />
</Tabs>
    );

}