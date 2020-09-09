import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { AppState, Platform } from 'react-native';
import PushNotification, {
  PushNotification as PNInterface,
} from 'react-native-push-notification';
import PubNub from 'pubnub';
import { ME_QUERY, MeQueryInterface } from '../queries/MeQueries';
import { ROOMS_QUERY, RoomsQuery } from '../queries/RoomQueries';
import { MessageRouteParams } from '../screens/MessagesStackScreen';
import { getNavigationRoute, navigate } from '../service/RootNavigation';
import { PRIMARY } from '../styles/Colors';
import { client } from './Apollo';
import { BugSnag } from './BugSnag';
import { userReady } from './firebase';
import { getPubNub } from './PubNub';

function isAndroidPushNotification(
  notification: PNInterface
): notification is AndroidNotification {
  return Platform.OS == 'android' && 'data' in notification;
}
function isIosPushNotification(
  notification: PNInterface
): notification is IosNotification {
  return (
    Platform.OS == 'ios' &&
    'data' in notification &&
    'data' in notification.data
  );
}
function isLocalNotification(
  notification: PNInterface
): notification is LocalNotification {
  return 'data' in notification && 'isLocal' in notification.data;
}

AppState.addEventListener('change', (newState) => {
  console.log(`AppState change: ${newState}`);
  if (newState === 'active') {
    // Clean up all notifications when the app is activated.
    PushNotification.cancelAllLocalNotifications();
  }
});

let deviceToken: { os: string; token: string } | undefined;
let deviceGateway: 'apns2' | 'gcm' | undefined;
let additionalConfig: Record<string, unknown> = {};

// Initial configuration needs to happen ASAP so that background notifications are
// handled. Otherwise they don't seem to hit the JS code at all.
PushNotification.configure({
  requestPermissions: true,
  popInitialNotification: false,
  // senderID: Platform.OS === 'android' ? '696329386413' : undefined,
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  onNotification(notification) {
    console.log(notification);
    let data: PushData | undefined,
      isLocal = false;
    if (isLocalNotification(notification)) {
      data = notification.data;
      isLocal = true;
    } else if (isAndroidPushNotification(notification)) {
      data = notification.data;
    } else if (isIosPushNotification(notification)) {
      data = notification.data.data;
    }

    if (data?.roomId && isLocal) {
      navigate('Message', { roomId: data.roomId });
      return;
    }

    if (data?.roomId && isLocal) {
      const route = getNavigationRoute();

      if (route && route.name == 'Message' && route.params) {
        const params = route.params as MessageRouteParams,
          currentRoomId = params.roomId || params.room?.roomId;

        if (currentRoomId === data.roomId) {
          // We already have this room open, we don't need/want a notification.
          return;
        }
      }
    }

    const isActive = AppState.currentState === 'active';

    if (isLocal) {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    } else {
      PushNotification.localNotification({
        color: PRIMARY,
        title: data?.title || '',
        message: data?.body || '',
        userInfo: {
          roomId: data?.roomId,
          isLocal: true,
        },
        // If sound isn't played when active, it appears to not show a notification but only add it to the drawer.
        playSound: true,
        soundName: 'default',
        // Don't vibrate if app is active.
        vibrate: !isActive,
        ticker: data?.title,
      });

      updateApplicationIconBadgeNumber(true).then(() => {
        notification.finish(PushNotificationIOS.FetchResult.NewData);
      });
    }
  },
  onRegister: async function (token) {
    console.log('PushNotification.onRegister', token);
    deviceToken = token;
    if (token.os === 'ios') {
      deviceGateway = 'apns2';
      additionalConfig = {
        environment: 'development',
        topic: 'app.konek.me',
      };
    } else if (token.os === 'android') {
      deviceGateway = 'gcm';
    } else {
      return;
    }

    const pubNub = await getPubNub();

    await refreshSubscriptions(pubNub, false);
  },
});

export async function refreshSubscriptions(
  pubNub: PubNub,
  forceRefresh: boolean
): Promise<void> {
  console.log('refreshSubscriptions');
  const { data } = await client.query<MeQueryInterface>({
    query: ME_QUERY,
    fetchPolicy: forceRefresh ? 'network-only' : 'cache-first',
  });

  if (!data || !deviceToken || !deviceGateway) {
    return;
  }

  const { channels: currentChannels } = await pubNub.push.listChannels({
      device: deviceToken.token,
      pushGateway: deviceGateway,
      ...additionalConfig,
    }),
    desiredChannels = data.me.pubNubInfo.channels;

  const remove: Array<string> = [],
    add: Array<string> = [];

  for (const currentChannel of currentChannels) {
    if (!desiredChannels.includes(currentChannel)) {
      remove.push(currentChannel);
    }
  }

  for (const desiredChannel of desiredChannels) {
    if (!currentChannels.includes(desiredChannel)) {
      add.push(desiredChannel);
    }
  }

  const tasks = [];

  if (remove.length > 0) {
    tasks.push(
      pubNub.push.removeChannels({
        device: deviceToken.token,
        channels: remove,
        pushGateway: deviceGateway,
        ...additionalConfig,
      })
    );
  }
  console.log(add.length, remove.length);

  if (add.length > 0) {
    tasks.push(
      pubNub.push.addChannels({
        device: deviceToken.token,
        channels: add,
        pushGateway: deviceGateway,
        ...additionalConfig,
      })
    );
  }

  if (tasks.length > 0) {
    await Promise.all(tasks);
  }
}

export async function clearSubscriptions(pubNub: PubNub): Promise<void> {
  if (!deviceToken || !deviceGateway) {
    return;
  }
  console.log('clearing Subscriptions');

  try {
    await pubNub.push.deleteDevice({
      pushGateway: deviceGateway,
      device: deviceToken.token,
      ...additionalConfig,
    });
  } catch (e) {
    console.log({ keys: Object.keys(e), json: JSON.stringify(e) });
    BugSnag && BugSnag.notify(e);
  }
}

export async function updateApplicationIconBadgeNumber(
  newMessage = false
): Promise<void> {
  // We need to wait until the firebase is initialized so that we can get the room listing.
  await userReady();
  let result;
  try {
    result = await client.query<RoomsQuery>({
      query: ROOMS_QUERY,
      fetchPolicy: 'cache-first',
    });
  } catch (e) {
    console.log('updateApplicationIconBadgeNumber: Unable to load room info.');
    BugSnag && BugSnag.notify(e);
  }

  if (!result || !result.data || result.data.rooms.length === 0) {
    if (newMessage) {
      if (Platform.OS === 'ios') {
        // We know that we received a new message so let's increment the badge number.
        PushNotification.getApplicationIconBadgeNumber((qty) => {
          PushNotification.setApplicationIconBadgeNumber(qty + 1);
        });
      }
    }
    return;
  }

  const qtyUnread = result.data.rooms.reduce<number>((prev, room) => {
    return prev + room.qtyUnread;
  }, 0);

  PushNotification.setApplicationIconBadgeNumber(qtyUnread);
}

interface PushData {
  roomId?: string;
  title?: string;
  body?: string;
}

interface AndroidNotification extends PNInterface {
  data: PushData;
}

interface IosNotification extends PNInterface {
  data: {
    data: PushData;
    aps: Record<string, unknown>;
  };
}

interface LocalNotification extends PNInterface {
  data: PushData & { isLocal: true };
}
