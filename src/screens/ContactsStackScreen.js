import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ContactsScreen from './ContactsScreen';
import ContactScreen from './ContactScreen';

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
});

const ContactsStack = createStackNavigator();

function ContactsStackScreen() {
  return (
    <ContactsStack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: '#FFFFFF',
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
          headerBackImage: () => (
            <TouchableOpacity style={styles.backContainer}>
              <MaterialIcons name="arrow-back" style={styles.backIcon} />
            </TouchableOpacity>
          ),
        }}
        component={ContactScreen}
      />
    </ContactsStack.Navigator>
  );
}

export default ContactsStackScreen;
