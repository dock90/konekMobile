import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
// screens
import MessagesScreen from './MessagesScreen';
import MessageScreen from './MessageScreen';
// components
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
    paddingLeft: 20,
    paddingTop: 10,
  },
});

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
        })}
        component={MessageScreen}
      />
    </MessagesStack.Navigator>
  );
}

export default MessagesStackScreen;
