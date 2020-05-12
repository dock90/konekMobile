import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import React, { useEffect, useState } from 'react';
import { AppRegistry } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import MainNavContainer from './components/MainNavContainer';
import { client } from './config/Apollo';
import { auth } from './config/firebase';
import AuthContainer from './components/AuthContainer';
import './config/PubNub';

enableScreens();

function App() {
  const [isAuthorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Listen for authentication state to change.
    return auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Authentication Success');
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    });
  });

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

AppRegistry.registerComponent('KonekMe', () => App);

export default App;
