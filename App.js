import React, { useEffect, useState } from 'react';
import { AppRegistry } from 'react-native';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from "@apollo/link-context";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { auth } from './config/firebase'
// components
import AuthContainer from './components/AuthContainer'
// screens
import MessagesScreen from './screens/MessagesScreen'
import ContactsScreen from './screens/ContactsScreen'
import ProfileScreen from './screens/ProfileScreen'

// configure gql server link
const httpLink = createHttpLink({
  uri: 'https://equipter-crm-staging.herokuapp.com/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await auth.currentUser.getIdToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// configure apollo client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

const Tab = createBottomTabNavigator();

function App() {
  const [fbAuth, setFbAuth] = useState(false);

  useEffect(() => {
    // Listen for authentication state to change.
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Authentication Success')
        setFbAuth(true)
      } else {
        setFbAuth(false)
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
      </ApolloProvider>
    );
  } else {
    return <AuthContainer />
  }
}

AppRegistry.registerComponent('KonekMe', () => App);

export default App;