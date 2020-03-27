import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
// screens
import ContactsScreen from './ContactsScreen'
import ContactScreen from './ContactScreen'
// components
import Header from '../components/Header'

const ContactsStack = createStackNavigator();

function ContactsStackScreen() {
  return (
    <ContactsStack.Navigator>
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
      <ContactsStack.Screen name="Contact" component={ContactScreen} />
    </ContactsStack.Navigator>
  );
}

export default ContactsStackScreen
