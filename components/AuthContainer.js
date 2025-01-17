import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// screens
import LoginScreen from '../screens/LoginScreen'
import ResetPassScreen from '../screens/ResetPassScreen'
import ResetPassSuccessScreen from '../screens/ResetPassSuccessScreen'
import SignupScreen from '../screens/SignupScreen'
import SignupConfirmScreen from '../screens/SignupConfirmScreen'

const Stack = createStackNavigator();

function AuthContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name="ResetPass" options={{ headerShown: false }} component={ResetPassScreen} />
        <Stack.Screen name="ResetPassSuccess" component={ResetPassSuccessScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="SignupConfirm" component={SignupConfirmScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthContainer
