import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainerRef } from '@react-navigation/core';
import { ContactsStackParamList } from '../screens/ContactsStackScreen';
import { TabNavParamList } from '../screens/MainNavContainer';
import { MessagesStackParamList } from '../screens/MessagesStackScreen';
import { ProfileStackParamList } from '../screens/Profile/ProfileStackScreen';

type Routes = TabNavParamList &
  MessagesStackParamList &
  ProfileStackParamList &
  ContactsStackParamList;

export const navigationRef = React.createRef<StackNavigationProp<Routes>>();

export function navigate(
  name: keyof Routes,
  params: Routes[keyof Routes]
): void {
  navigationRef.current?.navigate<keyof Routes>(name, params);
}

interface RouteInterface {
  name: keyof Routes | string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  params?: object;
}

export function getNavigationRoute(): undefined | RouteInterface {
  if (!navigationRef.current) {
    return undefined;
  }
  const current: NavigationContainerRef = (navigationRef.current as unknown) as NavigationContainerRef;
  return current.getCurrentRoute();
}
