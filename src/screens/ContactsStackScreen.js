import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
// screens
import ContactsScreen from './ContactsScreen';
import ContactScreen from './ContactScreen';
// components
import Header from '../components/Header';
// icons
import group3x from '../../assets/group3x.png';

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
      <ContactsStack.Screen
        name="Contacts"
        options={{
          header: () => {
            const title = 'Contacts';
            return <Header title={title} />;
          },
        }}
        component={ContactsScreen}
      />
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
              <Feather name="arrow-left" style={styles.backIcon} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Image source={group3x} style={styles.menu} />
            </TouchableOpacity>
          ),
        }}
        component={ContactScreen}
      />
    </ContactsStack.Navigator>
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

export default ContactsStackScreen;
