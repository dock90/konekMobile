import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
// screens
import MessagesScreen from './MessagesScreen'
import MessageScreen from './MessageScreen'
// components
import Header from '../components/Header'
// icons
import group3x from '../assets/group3x.png'

const MessagesStack = createStackNavigator();

function MessagesStackScreen() {
  return (
    <MessagesStack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: '#FFFFFF'
        }
      }}
    >
      <MessagesStack.Screen
        name="Messages"
        options={{
          header: () => {
            const title = 'Messages'
            return (
              <Header title={title} />
            )
          }
        }}
        component={MessagesScreen}
      />
      <MessagesStack.Screen
        name="Message"
        options={{
          headerStyle: {
            height: 70
          },
          headerRight: () => (
            <TouchableOpacity>
              <Image
                source={group3x}
                style={styles.menu}
              />
            </TouchableOpacity>
          ),
        }}
        component={MessageScreen}
      />
    </MessagesStack.Navigator>
  );
}

const styles = StyleSheet.create({
  menu: {
    height: 15,
    width: 15,
    marginRight: 20,
    marginBottom: 20,
  }
})

export default MessagesStackScreen
