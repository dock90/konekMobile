import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
// screens
import MessagesScreen from './screens/MessagesScreen'
import ContactsScreen from './screens/ContactsScreen'
import ProfileScreen from './screens/ProfileScreen'

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Messages"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Messages') {
              iconName = focused
                ? 'message-square'
                : 'message-square';
            } else if (route.name === 'Contacts') {
              iconName = focused ? 'book' : 'book';
            } else if (route.name == 'Profile') {
              iconName = focused ? 'user' : 'user'
            }
            return <Feather name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}

      >
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Contacts" component={ContactsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
