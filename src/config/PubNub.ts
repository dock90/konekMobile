import PubNub, { ListenerParameters, MessageEvent, StatusEvent } from 'pubnub';
import AsyncStorage from '@react-native-community/async-storage';
import { PUB_NUB_CONNECTION_STATE_QUERY } from '../queries/LocalStateQueries';
import { addMessage } from '../service/Messages';
import { client } from './Apollo';
import { ME_QUERY, MeQueryInterface } from '../queries/MeQueries';
import { BugSnag } from './BugSnag';
import { auth } from './firebase';
import { clearSubscriptions, refreshSubscriptions } from './PushNotifications';

const LOCAL_STORAGE_UUID_KEY = 'pnuuid';

async function getUuid() {
  let uuid = await AsyncStorage.getItem(LOCAL_STORAGE_UUID_KEY);

  if (!uuid) {
    uuid = '';
    while (uuid.length < 15) {
      uuid += Math.random().toString(36).substring(16);
    }

    uuid = uuid.substring(0, 15);

    await AsyncStorage.setItem(LOCAL_STORAGE_UUID_KEY, uuid);
  }

  return uuid;
}
function setConnected(connected: boolean) {
  client.writeQuery({
    query: PUB_NUB_CONNECTION_STATE_QUERY,
    data: { pnConnected: connected },
  });
}

const listeners: ListenerParameters = {
  message: async (message: MessageEvent) => {
    const data = message.message;
    switch (data.type) {
      case 'message':
        await addMessage(
          data.messageId,
          data.roomId,
          data.body,
          data.authorId,
          data.asset
        );
        break;
      case 'chChange':
        console.log(data.type);
        if (pn) {
          // TODO: refresh room list and contacts.
          await refreshSubscriptions(pn, true);
        }
        break;
      default:
        // Unknown message type.
        console.log(`Unknown message type: ${JSON.stringify(message)}`);
        break;
    }
  },
  status: async function (status: StatusEvent) {
    switch (status.category) {
      case PubNub.CATEGORIES.PNNetworkUpCategory:
      case PubNub.CATEGORIES.PNConnectedCategory:
      case PubNub.CATEGORIES.PNReconnectedCategory:
        setConnected(true);
        break;
      case PubNub.CATEGORIES.PNNetworkDownCategory:
      case PubNub.CATEGORIES.PNNetworkIssuesCategory:
      case PubNub.CATEGORIES.PNAccessDeniedCategory:
        setConnected(false);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await closePubNub();
        // Force a re-load of "me" so that it gets a new key, etc.
        await client.query({ query: ME_QUERY, fetchPolicy: 'network-only' });
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await initPubNub();
        break;
      default:
        console.log(status);
    }
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let pubNubResolve = (_pn: PubNub): void => {
  // noop
};
const pubNubPromise = new Promise<PubNub>((resolve) => {
  pubNubResolve = resolve;
});
let pn: PubNub | undefined;

export async function getPubNub(): Promise<PubNub> {
  return pubNubPromise;
}

/**
 * Must be called AFTER firebase has been authorized.
 * @return {Promise<void>}
 */
export async function initPubNub(): Promise<void> {
  if (pn) {
    return;
  }
  console.log('init PubNub');

  const { data } = await client.query<MeQueryInterface>({
    query: ME_QUERY,
  });
  if (!data) {
    return;
  }

  const pubNubInfo = data.me.pubNubInfo;

  pn = new PubNub({
    subscribeKey: pubNubInfo.subscribeKey,
    authKey: pubNubInfo.authKey,
    ssl: true,
    uuid: await getUuid(),
  });

  pn.addListener(listeners);

  pn.subscribe({
    channelGroups: [pubNubInfo.channelGroup],
  });

  pubNubResolve(pn);
}

/**
 *
 * @return {Promise<void>}
 */
export async function closePubNub(): Promise<void> {
  if (pn) {
    try {
      await clearSubscriptions(pn);
    } catch (e) {
      console.log(e);
      BugSnag && BugSnag.notify(e);
    }

    pn.removeListener(listeners);
    pn.unsubscribeAll();
    pn = undefined;
  }
}

auth.onAuthStateChanged(async (user) => {
  if (user) {
    await initPubNub();
  } else {
    await closePubNub();
  }
});
