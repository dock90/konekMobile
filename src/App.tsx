import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { enableScreens } from 'react-native-screens';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StatusBar, YellowBox } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import MainNavContainer from './screens/MainNavContainer';
import { client } from './config/Apollo';
import { auth } from './config/firebase';
import AuthContainer from './components/AuthContainer';
import './config/PubNub';
import { MaterialIcons } from '@expo/vector-icons';
import { loadAsync } from 'expo-font';

enableScreens();
// PubNub causes this warning, we can disable it.
YellowBox.ignoreWarnings(['Setting a timer']);

StatusBar.setHidden(false);
StatusBar.setBarStyle('dark-content');
if (Platform.OS === 'ios') {
  StatusBar.setNetworkActivityIndicatorVisible(true);
} else if (Platform.OS === 'android') {
  StatusBar.setTranslucent(false);
}

function App() {
  const [isAuthorized, setAuthorized] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const initApp = useCallback(async () => {
    await preventAutoHideAsync();
    await loadAsync(MaterialIcons.font);
    await hideAsync();
  }, []);

  useEffect(() => {
    initApp();
  });

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
  });

  if (!authReady) {
    return null;
  }

  if (isAuthorized) {
    return (
      <ApolloProvider client={client}>
        <MainNavContainer />
      </ApolloProvider>
    );
  } else {
    return <AuthContainer />;
  }
}

registerRootComponent(App);
