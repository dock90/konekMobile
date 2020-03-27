import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
// screens
import MessagesScreen from './MessagesScreen'
import MessageScreen from './MessageScreen'
// components
import Header from '../components/Header'

const MessagesStack = createStackNavigator();

function MessagesStackScreen() {
  return (
    <MessagesStack.Navigator>
      <MessagesStack.Screen
        name="Messages"
        options={{
          header: ({ scene, previous, navigation }) => {
            const title = 'Messages'
            return (
              <Header title={title} />
            )
          }
        }}
        component={MessagesScreen}
      />
      <MessagesStack.Screen name="Message" component={MessageScreen} />
    </MessagesStack.Navigator>
  );
}

export default MessagesStackScreen