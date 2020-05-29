import PubNub, { ListenerParameters, MessageEvent, StatusEvent } from 'pubnub';
import AsyncStorage from '@react-native-community/async-storage';
import { PUB_NUB_CONNECTION_STATE_QUERY } from '../queries/LocalStateQueries';
import { addMessage } from '../service/Messages';
import { client } from './Apollo';
import { ME_QUERY, MeQueryInterface } from '../queries/MeQueries';
import { auth } from './firebase';

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
    if (data.type !== 'message') {
      console.log(message);
      // We don't (yet) know how to do anything other than handle messages.
      return;
    }

    await addMessage(
      data.messageId,
      data.roomId,
      data.body,
      data.authorId,
      data.asset
    );
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

let pn: PubNub | undefined;

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
}

/**
 *
 * @return {Promise<void>}
 */
export async function closePubNub() {
  if (pn) {
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
