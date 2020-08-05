import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';
import { useMe } from '../hooks/useMe';
import { navigationRef } from '../service/RootNavigation';
import { BORDER, PRIMARY } from '../styles/Colors';
import MessagesTabIcon from './MainNav/MessagesTabIcon';
import MessagesStackScreen from './MessagesStackScreen';
import ContactsStackScreen from './ContactsStackScreen';
import Error from '../components/Error';
import Loading from '../components/Loading';
import ProfileStackScreen from './Profile/ProfileStackScreen';

export type TabNavParamList = {
  Messages: undefined;
  Contacts: undefined;
  Profile: undefined;
};

const Tabs = createBottomTabNavigator<TabNavParamList>();

const MainNavContainer: React.FC = () => {
  const { me, loading, error } = useMe();

  if (loading || !me) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Needed because I don't feel like trying to figure out the correct types when this works.
    <NavigationContainer ref={navigationRef}>
      <Tabs.Navigator
        initialRouteName={me.access.messages ? 'Messages' : 'Profile'}
        tabBarOptions={{
          activeTintColor: PRIMARY,
          inactiveTintColor: BORDER,
        }}
        screenOptions={{
          // If we don't have permission to message, there isn't anything
          // useful on the tab bar.
          tabBarVisible: me.access.messages,
        }}
      >
        <Tabs.Screen
          name="Messages"
          options={({ route }) => {
            // All this ignore ugliness is so that everything stays on the same line so that the ignores work!
            // prettier-ignore
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const routeName = route.state ? route.state.routes[route.state.index].name : route.params?.screen || 'Messages';

            return {
              tabBarVisible: routeName !== 'Message',
              tabBarIcon: ({ color, size }) => (
                <MessagesTabIcon color={color} size={size} />
              ),
            };
          }}
          component={MessagesStackScreen}
        />
        <Tabs.Screen
          name="Contacts"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="people" size={size} color={color} />
            ),
          }}
          component={ContactsStackScreen}
        />
        <Tabs.Screen
          name="Profile"
          options={({ route }) => {
            // prettier-ignore
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const routeName = route.state ? route.state.routes[route.state.index].name : route.params?.screen || 'Profile';

            return {
              tabBarVisible: routeName === 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Avatar size={size} style={{ color }} picture={me.picture} />
              ),
            };
          }}
          component={ProfileStackScreen}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
};

export default MainNavContainer;
