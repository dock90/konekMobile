import {
  ApolloCache,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client';
import { client } from '../config/Apollo';
import { AssetFieldsInterface, AssetInterface } from '../queries/AssetQueries';
import {
  MessageFieldsInterface,
  MESSAGES_QUERY,
  MessagesQueryInterface,
  SEND_MESSAGE_MUTATION,
  SendMessageMutationResult,
  SendMessageMutationVariables,
  SET_READ_THROUGH,
} from '../queries/MessageQueries';
import { MEMBER_FIELDS, MEMBER_QUERY } from '../queries/MemberQueries';
import {
  ROOM_FIELDS,
  RoomFieldsInterface,
  ROOMS_QUERY,
  RoomsQuery,
} from '../queries/RoomQueries';

function hasPreviousMessage(
  messages: { data: Array<MessageFieldsInterface> },
  messageId: string
): boolean {
  return !!messages.data.find((m) => m.messageId === messageId);
}

function orderRooms(
  topRoomId: string,
  client: ApolloClient<NormalizedCacheObject> | ApolloCache<unknown>
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const roomsQuery = client.readQuery<RoomsQuery>({
    query: ROOMS_QUERY,
  });
  if (!roomsQuery) {
    return;
  }

  const rooms = roomsQuery.rooms,
    newRooms = [...rooms];

  for (let i = 0; i < rooms.length; i++) {
    const r = rooms[i];
    if (r.roomId === topRoomId) {
      if (i === 0) {
        // If we're already at the top, there is nothing to do, we can abort early.
        return;
      }
      newRooms.splice(i, 1);
      newRooms.unshift(r);
      break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  client.writeQuery({
    query: ROOMS_QUERY,
    data: { rooms: newRooms },
  });
}

function getRoomInfo(roomId: string): RoomFieldsInterface | null {
  return client.readFragment({
    id: roomId,
    fragment: ROOM_FIELDS,
    fragmentName: 'RoomFields',
  });
}

export async function sendMessage(
  roomId: string,
  body: string,
  asset?: AssetInterface
): Promise<void> {
  await client.mutate<SendMessageMutationResult, SendMessageMutationVariables>({
    mutation: SEND_MESSAGE_MUTATION,
    variables: { roomId, body, asset },
    update(proxy, { data }) {
      const messagesData = proxy.readQuery<MessagesQueryInterface>({
        query: MESSAGES_QUERY,
        variables: { roomId: roomId, after: null },
      });
      if (!messagesData) {
        return;
      }
      const messages = messagesData.messages;

      if (!data || hasPreviousMessage(messages, data.sendMessage.messageId)) {
        // PubNub sometimes gets the message delivered before we get our response back.
        return;
      }

      // Write to cache so the UI updates.
      proxy.writeQuery({
        query: MESSAGES_QUERY,
        data: {
          messages: {
            ...messages,
            data: [data.sendMessage, ...messages.data],
          },
        },
        variables: {
          roomId: roomId,
          after: null,
        },
      });

      orderRooms(roomId, proxy);

      // We can't use "markAllRead" because the cache hasn't actually been committed at this point so the
      // message we just added won't be available.
      const roomInfo = proxy.readFragment<RoomFieldsInterface>({
        id: roomId,
        fragment: ROOM_FIELDS,
        fragmentName: 'RoomFields',
      });

      if (!roomInfo) {
        return;
      }

      roomInfo.readThrough = data.sendMessage.messageId;

      proxy.writeFragment({
        id: roomId,
        fragment: ROOM_FIELDS,
        fragmentName: 'RoomFields',
        data: roomInfo,
      });
    },
  });
}

export async function addMessage(
  messageId: string,
  roomId: string,
  body: string,
  authorId: string,
  asset: AssetInterface
): Promise<void> {
  const roomInfo = getRoomInfo(roomId);

  if (!roomInfo) {
    // The room info isn't currently  in the cache, so we need to refresh the room list.
    await client.query<RoomsQuery>({
      // force a refresh of the rooms list.
      fetchPolicy: 'network-only',
      query: ROOMS_QUERY,
    });
  } else if (roomInfo.memberId !== authorId) {
    // We aren't the sender, so we want to update the qty unread.
    client.writeFragment({
      id: roomId,
      fragment: ROOM_FIELDS,
      fragmentName: 'RoomFields',
      data: {
        ...roomInfo,
        // For some unknown reason, I couldn't modify the value directly. Doing a console.log
        // before and after doing roomInfo.qtyUnread++ would show the same number both times!
        // I'm suspicious that the cache is immutable or something but couldn't find any info
        // in the docs.
        qtyUnread: roomInfo.qtyUnread + 1,
      },
    });
  }

  orderRooms(roomId, client);

  let query;
  try {
    query = client.readQuery<MessagesQueryInterface>({
      query: MESSAGES_QUERY,
      variables: { roomId, after: null },
    });
    if (!query) {
      return;
    }
  } catch (e) {
    // There are no messages loaded for this room, so we can exit without updating anything.
    return;
  }

  if (hasPreviousMessage(query.messages, messageId)) {
    // This message is already in the list! Our job is already done.
    return;
  }

  let authorInfo = client.readFragment({
    fragment: MEMBER_FIELDS,
    id: authorId,
    fragmentName: 'MemberFields',
  });

  if (!authorInfo) {
    // we gotta load the author info from the API. 🙁
    const { data } = await client.query({
      query: MEMBER_QUERY,
      variables: {
        memberId: authorId,
        roomId: roomId,
      },
    });

    authorInfo = data.member;
  }
  let assetField: AssetFieldsInterface | null = null;
  if (asset) {
    assetField = {
      ...asset,
      __typename: 'Asset',
    };
    if (!assetField.originalFilename) {
      // Not sure why, but Apollo is dying when this field doesn't exist.
      assetField.originalFilename = null;
    }
  }

  const newMessage: MessageFieldsInterface = {
    messageId,
    body,
    asset: assetField,
    createdAt: new Date().toISOString(),
    author: authorInfo,
    __typename: 'Message',
  };

  client.writeQuery({
    query: MESSAGES_QUERY,
    variables: { roomId, after: null },
    data: {
      messages: {
        ...query.messages,
        data: [newMessage, ...query.messages.data],
      },
    },
  });
}

function writeRoomInfo(roomId: string, info: RoomFieldsInterface): void {
  client.writeFragment({
    id: roomId,
    fragment: ROOM_FIELDS,
    fragmentName: 'RoomFields',
    data: info,
  });
}

export async function markAllRead(roomId: string, updateServer = true) {
  const roomInfo = getRoomInfo(roomId);

  if (!roomInfo) {
    return;
  }

  if (roomInfo.qtyUnread <= 0) {
    return;
  }

  let messages;
  try {
    // get the local message list.
    const data = client.readQuery({
      query: MESSAGES_QUERY,
      variables: { roomId, after: null },
    });
    messages = data.messages;
  } catch (e) {
    console.log(
      '💥 This really should never happen, but you never know. 💥',
      e
    );
    return;
  }

  const messageId = messages.data[0].messageId;

  roomInfo.qtyUnread = 0;
  roomInfo.readThrough = messageId;

  writeRoomInfo(roomId, roomInfo);

  if (!updateServer) {
    return;
  }

  const results = await client.mutate({
    mutation: SET_READ_THROUGH,
    variables: { roomId, messageId },
  });

  writeRoomInfo(roomId, results.data.setReadThrough);
}
