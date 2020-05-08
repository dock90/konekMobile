import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { AppRegistry } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { client } from './config/Apollo';
import { auth } from './config/firebase';
// components
import AuthContainer from './components/AuthContainer';
// screens
import MessagesStackScreen from './screens/MessagesStackScreen';
import ContactsStackScreen from './screens/ContactsStackScreen';
import ProfileScreen from './screens/ProfileScreen';
import { PRIMARY } from './styles/Colors';

const Tab = createBottomTabNavigator();

function App() {
  const [fbAuth, setFbAuth] = useState(false);

  useEffect(() => {
    // Listen for authentication state to change.
    return auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Authentication Success');
        setFbAuth(true);
      } else {
        setFbAuth(false);
      }
    });
  });

  if (fbAuth) {
    return (
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Messages"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Messages') {
                  iconName = focused ? 'message-square' : 'message-square';
                } else if (route.name === 'Contacts') {
                  iconName = focused ? 'book' : 'book';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'user' : 'user';
                }
                return <Feather name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: PRIMARY,
              inactiveTintColor: 'gray',
            }}
          >
            <Tab.Screen
              name="Messages"
              options={({ route }) => {
                const routeName = route.state
                  ? route.state.routes[route.state.index].name
                  : route.params?.screen || 'Messages';
                return {
                  tabBarVisible: routeName !== 'Message',
                };
              }}
              component={MessagesStackScreen}
            />
            <Tab.Screen name="Contacts" component={ContactsStackScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    );
  } else {
    return <AuthContainer />;
  }
}

AppRegistry.registerComponent('KonekMe', () => App);

export default App;
