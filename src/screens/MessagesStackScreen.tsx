import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import RoomsScreen from './RoomsScreen';
import MessageScreen from './MessageScreen';
import Header from '../components/Header';
import HeaderUser from '../components/HeaderUser';

const styles = StyleSheet.create({
  backContainer: {
    width: 60,
    height: 40,
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 25,
    paddingLeft: 0,
    paddingTop: 10,
  },
});

export type MessagesStackParamList = {
  Rooms: undefined;
  Message: {
    name: string;
    roomId: string;
  };
};

const MessagesStack = createStackNavigator<MessagesStackParamList>();

const MessagesStackScreen: React.FC = () => {
  return (
    <MessagesStack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <MessagesStack.Screen
        name="Rooms"
        options={{
          header: () => <Header title="Messages" />,
        }}
        component={RoomsScreen}
      />
      <MessagesStack.Screen
        name="Message"
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerStyle: {
            height: 70,
            shadowRadius: 2,
          },
          headerBackImage: () => (
            <TouchableOpacity style={styles.backContainer}>
              <MaterialIcons name="arrow-back" style={styles.backIcon} />
            </TouchableOpacity>
          ),
          headerTitle: () => <HeaderUser route={route} />,
          headerTitleAlign: 'left',
        })}
        component={MessageScreen}
      />
    </MessagesStack.Navigator>
  );
};

export default MessagesStackScreen;
