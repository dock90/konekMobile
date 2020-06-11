import { Platform } from 'react-native';
import PushNotification, {
  PushNotification as PNInterface,
} from 'react-native-push-notification';
import PubNub from 'pubnub';
import { ME_QUERY, MeQueryInterface } from '../queries/MeQueries';
import { navigate } from '../service/RootNavigation';
import { client } from './Apollo';

function isAndroidPushNotification(
  notification: PNInterface
): notification is AndroidNotification {
  return Platform.OS == 'android' && 'roomId' in notification;
}
function isIosPushNotification(
  notification: PNInterface
): notification is IosNotification {
  return Platform.OS == 'ios' && 'data' in notification;
}

let deviceToken: { os: string; token: string } | undefined;
let deviceGateway: 'apns2' | 'gcm' | undefined;

export async function refreshSubscriptions(
  pubNub: PubNub,
  forceRefresh: boolean
): Promise<void> {
  const { data } = await client.query<MeQueryInterface>({
    query: ME_QUERY,
    fetchPolicy: forceRefresh ? 'network-only' : 'cache-first',
  });

  if (!data) {
    return;
  }

  PushNotification.configure({
    requestPermissions: true,
    popInitialNotification: true,
    senderID: Platform.OS === 'android' ? '696329386413' : undefined,
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    onRegister: async function (token) {
      deviceToken = token;
      let additionalConfig: Record<string, unknown> = {};
      if (token.os === 'ios') {
        deviceGateway = 'apns2';
        additionalConfig = {
          environment: 'production',
          topic: 'app.konek.me',
        };
      } else if (token.os === 'android') {
        deviceGateway = 'gcm';
      } else {
        return;
      }

      const { channels: currentChannels } = await pubNub.push.listChannels({
          device: token.token,
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
            device: token.token,
            channels: remove,
            pushGateway: deviceGateway,
            ...additionalConfig,
          })
        );
      }

      if (add.length > 0) {
        tasks.push(
          pubNub.push.addChannels({
            device: token.token,
            channels: add,
            pushGateway: deviceGateway,
            ...additionalConfig,
          })
        );
      }

      await Promise.all(tasks);
    },
    onNotification(notification) {
      let roomId: string | undefined;
      if (isAndroidPushNotification(notification)) {
        roomId = notification.roomId;
      } else if (isIosPushNotification(notification)) {
        roomId = notification.data.aps.roomId;
      }
      if (roomId) {
        navigate('Message', { roomId });
      }
    },
  });
}

export async function clearSubscriptions(pubNub: PubNub): Promise<void> {
  if (!deviceToken || !deviceGateway) {
    return;
  }

  await pubNub.push.deleteDevice({
    pushGateway: deviceGateway,
    device: deviceToken.token,
  });
}

interface AndroidNotification extends PNInterface {
  roomId?: string;
}

interface IosNotification extends PNInterface {
  data: {
    aps: {
      roomId?: string;
    };
  };
}
