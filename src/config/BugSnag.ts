import { Client } from 'bugsnag-react-native';
let bugsnag;

if (!__DEV__) {
  // Only initialize BugSnag in prod.
  try {
    bugsnag = new Client('223f4e376ac63ab606514d958a1577b3');
  } catch (e) {
    console.log(e);
  }
}

export const BugSnag = bugsnag;