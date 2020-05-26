import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ResetPassScreen from '../screens/ResetPassScreen';
import ResetPassSuccessScreen from '../screens/ResetPassSuccessScreen';
import SignupScreen from '../screens/SignupScreen';

export type AuthStack = {
  Login: undefined;
  ResetPass: undefined;
  ResetPassSuccess: undefined;
  Signup: undefined;
  SignupConfirm: undefined;
};

const Stack = createStackNavigator<AuthStack>();

function AuthContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ResetPass" component={ResetPassScreen} />
        <Stack.Screen
          name="ResetPassSuccess"
          component={ResetPassSuccessScreen}
        />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthContainer;
