import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
// screens
import ContactsScreen from './ContactsScreen'
import ContactScreen from './ContactScreen'
// components
import Header from '../components/Header'

const ContactsStack = createStackNavigator();

function ContactsStackScreen({ navigation }) {
  return (
    <ContactsStack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: '#FFFFFF'
        }
      }}
    >
      <ContactsStack.Screen
        name="Contacts"
        options={{
          header: () => {
            const title = 'Contacts'
            return (
              <Header title={title} />
            )
          }
        }}
        component={ContactsScreen}
      />
      <ContactsStack.Screen
        name="Contact"
        options={{
          title: '',
          headerBackTitleVisible: false,
        }}
        component={ContactScreen}
      />
    </ContactsStack.Navigator>
  );
}

export default ContactsStackScreen
