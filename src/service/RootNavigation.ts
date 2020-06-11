import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabNavParamList } from '../screens/MainNavContainer';
import { MessagesStackParamList } from '../screens/MessagesStackScreen';

type Routes = TabNavParamList & MessagesStackParamList;

export const navigationRef = React.createRef<StackNavigationProp<Routes>>();

export const navigate = function (
  name: keyof Routes,
  params: Routes[keyof Routes]
): void {
  navigationRef.current?.navigate<keyof Routes>(name, params);
};
