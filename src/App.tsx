import './config/BugSnag';
import 'react-native-gesture-handler';
import 'expo-asset';
import { BugSnag } from './config/BugSnag';
import { auth } from './config/firebase';
import { client } from './config/Apollo';
import './config/PubNub';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { enableScreens } from 'react-native-screens';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StatusBar,
  LogBox,
  AppRegistry,
  UIManager,
} from 'react-native';
import { ApolloProvider } from '@apollo/client';
import MainNavContainer from './screens/MainNavContainer';
import AuthContainer from './components/AuthContainer';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { loadAsync } from 'expo-font';

enableScreens();
// PubNub causes this warning, we can disable it.
LogBox.ignoreLogs(['Setting a timer']);

if (Platform.OS === 'ios') {
  StatusBar.setNetworkActivityIndicatorVisible(true);
} else if (Platform.OS === 'android') {
  StatusBar.setTranslucent(false);
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

async function initApp(): Promise<void> {
  try {
    await preventAutoHideAsync();
    await Promise.all([
      loadAsync(MaterialIcons.font),
      loadAsync(MaterialCommunityIcons.font),
    ]);
    await hideAsync();
  } catch (e) {
    console.log(e);
    try {
      BugSnag && BugSnag.notify(e);
    } catch (e) {}
  }
}

initApp();

const App: React.FC = () => {
  const [isAuthorized, setAuthorized] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Listen for authentication state to change.
    return auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Authentication Success');
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setAuthReady(true);
    });
  }, []);

  if (!authReady) {
    return null;
  }

  if (isAuthorized) {
    return (
      <>
        <StatusBar
          hidden={false}
          barStyle={
            Platform.OS === 'android' ? 'light-content' : 'dark-content'
          }
        />
        <ApolloProvider client={client}>
          <MainNavContainer />
        </ApolloProvider>
      </>
    );
  } else {
    return <AuthContainer />;
  }
};

AppRegistry.registerComponent('main', () => App);
