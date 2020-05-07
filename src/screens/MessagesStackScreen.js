import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
// screens
import MessagesScreen from './MessagesScreen';
import MessageScreen from './MessageScreen';
// components
import Header from '../components/Header';
import HeaderUser from '../components/HeaderUser';
// icons
import group3x from '../../assets/group3x.png';

const MessagesStack = createStackNavigator();

function MessagesStackScreen() {
  return (
    <MessagesStack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <MessagesStack.Screen
        name="Messages"
        options={{
          header: () => {
            const title = 'Messages';
            return <Header title={title} />;
          },
        }}
        component={MessagesScreen}
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
              <Feather name="arrow-left" style={styles.backIcon} />
            </TouchableOpacity>
          ),
          headerTitle: () => <HeaderUser route={route} />,
          headerTitleAlign: 'left',
          headerRight: () => (
            <TouchableOpacity>
              <Image source={group3x} style={styles.menu} />
            </TouchableOpacity>
          ),
        })}
        component={MessageScreen}
      />
    </MessagesStack.Navigator>
  );
}

const styles = StyleSheet.create({
  backContainer: {
    width: 60,
    height: 40,
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 25,
    paddingLeft: 20,
    paddingTop: 10,
  },
  menu: {
    height: 15,
    width: 15,
    marginRight: 20,
    marginBottom: 20,
  },
});

export default MessagesStackScreen;
