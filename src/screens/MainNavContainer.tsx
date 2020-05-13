import { useQuery } from '@apollo/client';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { ME_QUERY, MeQueryInterface } from '../queries/MeQueries';
import { BORDER, PRIMARY } from '../styles/Colors';
import MessagesStackScreen from './MessagesStackScreen';
import ContactsStackScreen from './ContactsStackScreen';
import ProfileScreen from './ProfileScreen';
import { MeContext } from '../contexts/MeContext';
import Error from '../components/Error';
import Loading from '../components/Loading';

export type TabNavParamList = {
  Messages: undefined;
  Contacts: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabNavParamList>();

const MainNavContainer: React.FC = () => {
  const { data, loading, error } = useQuery<MeQueryInterface>(ME_QUERY);

  if (loading || !data) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return (
    <MeContext.Provider value={data.me}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Messages"
          tabBarOptions={{
            activeTintColor: PRIMARY,
            inactiveTintColor: BORDER,
          }}
        >
          <Tab.Screen
            name="Messages"
            options={({ route }) => {
              // All this ignore ugliness is so that everything stays on the same line so that the ignores work!
              // prettier-ignore
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              const routeName = route.state ? route.state.routes[route.state.index].name : route.params?.screen || 'Messages';

              return {
                tabBarVisible: routeName !== 'Message',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="chat" size={size} color={color} />
                ),
              };
            }}
            component={MessagesStackScreen}
          />
          <Tab.Screen
            name="Contacts"
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="people" size={size} color={color} />
              ),
            }}
            component={ContactsStackScreen}
          />
          <Tab.Screen
            name="Profile"
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="person" size={size} color={color} />
              ),
            }}
            component={ProfileScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </MeContext.Provider>
  );
};

export default MainNavContainer;
