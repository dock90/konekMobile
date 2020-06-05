import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import HeaderBackImage from '../components/HeaderBackImage';
import { BACKGROUND } from '../styles/Colors';
import ContactsScreen from './ContactsScreen';
import ContactScreen from './ContactScreen';

export type ContactsStack = {
  Contacts: undefined;
  Contact: {
    contactId: string;
  };
};

const ContactsStack = createStackNavigator<ContactsStack>();

function ContactsStackScreen() {
  return (
    <ContactsStack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: BACKGROUND,
        },
      }}
    >
      <ContactsStack.Screen name="Contacts" component={ContactsScreen} />
      <ContactsStack.Screen
        name="Contact"
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerStyle: {
            height: 70,
            shadowColor: 'transparent',
          },
          headerBackImage:
            Platform.OS === 'android' ? undefined : () => <HeaderBackImage />,
        }}
        component={ContactScreen}
      />
    </ContactsStack.Navigator>
  );
}

export default ContactsStackScreen;
