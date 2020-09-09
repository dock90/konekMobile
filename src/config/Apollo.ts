import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { PUB_NUB_CONNECTION_STATE_QUERY } from '../queries/LocalStateQueries';
import {
  PersonFieldsInterface,
  personKeyExtractor,
} from '../queries/PeopleQueries';
import { auth } from './firebase';
import {
  ROOM_FIELDS,
  ROOM_QUERY,
  RoomFieldsInterface,
  ROOMS_QUERY,
} from '../queries/RoomQueries';

const httpLink = createHttpLink({
  uri: 'https://equipter-crm-staging.herokuapp.com/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  let token;

  if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const cache = new InMemoryCache({
  addTypename: false,
  typePolicies: {
    Asset: {
      keyFields: () => undefined,
    },
    Me: {
      // Will only ever be one, so a static ID is fine.
      keyFields: () => 'Me',
    },
    Note: {
      keyFields: ['entryId'],
    },
    Conversation: {
      keyFields: ['entryId'],
    },
    Person: {
      keyFields: (object) =>
        personKeyExtractor((object as unknown) as PersonFieldsInterface),
    },
  },
  dataIdFromObject: (object): string | undefined => {
    const typeName = object.__typename;
    if (!typeName) {
      return undefined;
    }
    switch (typeName) {
      default:
        const idField = `${
          typeName.charAt(0).toLowerCase() + typeName.slice(1)
        }Id`;
        if (idField in object) {
          return object[idField] as string;
        }
    }
    console.warn(`Unable to find ID for object of type "${typeName}"`);
    return undefined;
  },
  possibleTypes: {
    EntryTypeInterface: ['Note', 'Conversation'],
  },
});

export const client = new ApolloClient({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore There is a bug in the types.
  link: authLink.concat(httpLink),
  cache,
  resolvers: {
    Query: {
      async room(_obj, args, ctx): Promise<undefined | unknown> {
        if (!args.roomId) {
          return undefined;
        }

        const roomInfo = ctx.cache.readFragment({
          fragment: ROOM_FIELDS,
          fragmentName: 'RoomFields',
          id: args.roomId,
        });

        if (roomInfo) {
          // It is already in the cache. Life is so simple sometimes, enjoy it while it lasts. 👴
          return roomInfo;
        }

        // Get the current room list.
        const { data: roomList } = await ctx.client.query({
          query: ROOMS_QUERY,
        });

        // Check if the current room list includes have the room we're searching for.
        // This can happen if the "rooms" (plural) query hasn't completed yet when the "room" (singular) is queried.
        const match = roomList.rooms.find(
          (r: RoomFieldsInterface) => r.roomId === args.roomId
        );

        if (match) {
          return match;
        }

        // Load the requested room.
        const result = await ctx.client.query({
          query: ROOM_QUERY,
          variables: {
            roomId: args.roomId,
          },
        });

        // Update the cache with the requested room.
        ctx.cache.writeQuery({
          query: ROOMS_QUERY,
          data: {
            rooms: [result.data.room, ...roomList.rooms],
          },
        });

        return result.data.room;
      },
    },
  },
});

function initCache(): void {
  cache.writeQuery({
    query: PUB_NUB_CONNECTION_STATE_QUERY,
    data: {
      pnConnected: false,
    },
  });
}
initCache();

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    try {
      // Clear the cache when a user logs out.
      await client.resetStore();
    } catch (e) {
      console.log(e);
    }
    initCache();
  }
});
