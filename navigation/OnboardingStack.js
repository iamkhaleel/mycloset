import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "../screens/OnBoarding/WelcomeScreen";
import Login from "../screens/OnBoarding/Login";
import QuestionOne from "../screens/OnBoarding/QuestionOne";
import QuestionThree from "../screens/OnBoarding/Questionthree";
import SignUp from "../screens/OnBoarding/SignUp";

const Stack = createStackNavigator();

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="QuestionOne" component={QuestionOne} />
      <Stack.Screen name="QuestionThree" component={QuestionThree} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
