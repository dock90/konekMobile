import * as firebase from 'firebase/app';
import 'firebase/auth';
import { BugSnag } from './BugSnag';

// initialize config
const config = {
  apiKey: 'AIzaSyC8mLBfTQxv2gfJ8UrXtl6_qsL9awCbtxE',
  authDomain: 'equiptercrm.firebaseapp.com',
  databaseURL: 'https://equiptercrm.firebaseio.com',
  projectId: 'equiptercrm',
  storageBucket: 'equiptercrm.appspot.com',
  messagingSenderId: '696329386413',
  appId: '1:696329386413:web:58d6f07a93260918024924',
  measurementId: 'G-D4702DD6V3',
};

// initialize firebase
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const auth = firebase.auth();

if (BugSnag) {
  auth.onAuthStateChanged((user) => {
    if (user && BugSnag) {
      BugSnag.setUser(
        user.uid,
        user.displayName || undefined,
        user.email || undefined
      );
    } else if (BugSnag) {
      BugSnag.clearUser();
    }
  });
}

let userResolver = (): void => {};
const userPromise = new Promise<null>((resolve) => {
  userResolver = resolve;
});

export function userReady(): Promise<null> {
  return userPromise;
}

auth.onAuthStateChanged((user) => {
  if (user) {
    userResolver();
  }
});
