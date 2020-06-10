import PushNotification from 'react-native-push-notification';
import PubNub from 'pubnub';
import { ME_QUERY, MeQueryInterface } from '../queries/MeQueries';
import { client } from './Apollo';

let deviceToken: { os: string; token: string } | undefined;
let deviceGateway: 'apns' | 'apns2' | 'gcm' | undefined;

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
    senderID: '696329386413',
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    onRegister: async function (token) {
      deviceToken = token;
      let additionalConfig: object = {};
      if (token.os === 'ios') {
        deviceGateway = 'apns2';
        additionalConfig = {
          environment: 'production',
          topic: 'com.konek.me',
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
      console.log(`notification: ${JSON.stringify(notification)}`);
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
