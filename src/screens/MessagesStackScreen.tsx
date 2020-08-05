import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import HeaderBackImage from '../components/HeaderBackImage';
import { RoomFieldsInterface } from '../queries/RoomQueries';
import { BACKGROUND } from '../styles/Colors';
import RoomsScreen from './RoomsScreen';
import MessageScreen from './MessageScreen';

export interface MessageRouteParams {
  /**
   * room OR roomId are required! Use room if you have it as it will require one
   * less query to the server.
   */
  room?: RoomFieldsInterface;
  roomId?: string;
}

export type MessagesStackParamList = {
  Rooms: undefined;
  Message: MessageRouteParams;
};

const MessagesStack = createStackNavigator<MessagesStackParamList>();

const MessagesStackScreen: React.FC = () => {
  return (
    <MessagesStack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: BACKGROUND,
        },
      }}
    >
      <MessagesStack.Screen
        name="Rooms"
        options={{
          title: 'Messages',
        }}
        component={RoomsScreen}
      />
      <MessagesStack.Screen
        name="Message"
        options={{
          headerBackTitleVisible: false,
          headerBackImage:
            Platform.OS === 'android'
              ? undefined
              : (): React.ReactNode => <HeaderBackImage />,
          headerTitleAlign: 'left',
        }}
        component={MessageScreen}
      />
    </MessagesStack.Navigator>
  );
};

export default MessagesStackScreen;
