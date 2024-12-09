import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Intro from "./screens/Intro";
import Recording from "./screens/Recording";
import SignInScreen from "./screens/SignInScreen ";
import SignUpScreen from "./screens/SignUpScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Recording">
        <Stack.Screen name="intro" component={Intro} />
        <Stack.Screen name="signup" component={SignUpScreen} />
        <Stack.Screen name="signin" component={SignInScreen} />
        <Stack.Screen name="Recording" component={Recording} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
