import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import HeaderBackImage from '../components/HeaderBackImage';
import { PersonFieldsInterface } from '../queries/PeopleQueries';
import { BACKGROUND } from '../styles/Colors';
import ContactsScreen from './ContactsScreen';
import PersonScreen from './PersonScreen';

export type ContactsStack = {
  People: undefined;
  Person: {
    person: PersonFieldsInterface;
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
      <ContactsStack.Screen name="People" component={ContactsScreen} />
      <ContactsStack.Screen
        name="Person"
        options={{
          headerBackImage:
            Platform.OS === 'android' ? undefined : () => <HeaderBackImage />,
        }}
        component={PersonScreen}
      />
    </ContactsStack.Navigator>
  );
}

export default ContactsStackScreen;
