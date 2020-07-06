import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import HeaderBackImage from '../../components/HeaderBackImage';
import { BACKGROUND } from '../../styles/Colors';
import ProfileEditScreen from './ProfileEditScreen';
import ProfileScreen from './ProfileScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
};

const ProfileStack = createStackNavigator<ProfileStackParamList>();

const ProfileStackScreen: React.FC = () => (
  <ProfileStack.Navigator
    screenOptions={{
      cardStyle: {
        backgroundColor: BACKGROUND,
      },
    }}
  >
    <ProfileStack.Screen
      options={{ headerShown: false }}
      name="Profile"
      component={ProfileScreen}
    />
    <ProfileStack.Screen
      name="ProfileEdit"
      options={{
        title: 'Edit Profile',
        // Required for iOS.
        headerBackTitleVisible: false,
        headerBackImage:
          Platform.OS === 'android' ? undefined : () => <HeaderBackImage />,
      }}
      component={ProfileEditScreen}
    />
  </ProfileStack.Navigator>
);

export default ProfileStackScreen;
