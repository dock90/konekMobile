import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileEditScreen from './ProfileEditScreen';
import ProfileScreen from './ProfileScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
};

const ProfileStack = createStackNavigator<ProfileStackParamList>();

const ProfileStackScreen: React.FC = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      options={{ headerShown: false }}
      name="Profile"
      component={ProfileScreen}
    />
    <ProfileStack.Screen
      name="ProfileEdit"
      options={{ title: 'Edit Profile' }}
      component={ProfileEditScreen}
    />
  </ProfileStack.Navigator>
);

export default ProfileStackScreen;
