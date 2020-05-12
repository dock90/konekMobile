import { useQuery } from '@apollo/client';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { ME_QUERY, MeQueryInterface } from '../queries/MeQueries';
import { PRIMARY } from '../styles/Colors';
import MessagesStackScreen from '../screens/MessagesStackScreen';
import ContactsStackScreen from '../screens/ContactsStackScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MeContext } from '../contexts/MeContext';
import Error from './Error';
import Loading from './Loading';

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
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = '';
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
              // console.log(route);
              const routeName = route.state
                ? route.state.routes[route.state.index].name
                : route.params?.screen || 'Messages';

              return {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                tabBarVisible: routeName !== 'Message',
              };
            }}
            component={MessagesStackScreen}
          />
          <Tab.Screen name="Contacts" component={ContactsStackScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </MeContext.Provider>
  );
};

export default MainNavContainer;
