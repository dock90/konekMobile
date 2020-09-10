import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Route,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useQuery } from '@apollo/client';
import Error from '../components/Error';
import Header from '../components/Header';
import Loading from '../components/Loading';
import ActionButton from '../components/Messaging/ActionButton';
import Attach from '../components/Messaging/Attach';
import { AssetInterface } from '../queries/AssetQueries';
import {
  MessageQueryVariables,
  MESSAGES_QUERY,
  MessagesQueryInterface,
} from '../queries/MessageQueries';
import Message from '../components/Message';
import {
  ROOM_QUERY,
  RoomFieldsInterface,
  RoomQuery,
  RoomQueryVariables,
} from '../queries/RoomQueries';
import { markAllRead, sendMessage } from '../service/Messages';
import { PLACEHOLDER_TEXT, PRIMARY, TEXT_INPUT } from '../styles/Colors';
import { MessagesStackParamList } from './MessagesStackScreen';
import BeginningOfConversation from '../components/Messaging/BeginningOfConversation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  messages: {
    flex: 1,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'lightgray',
  },
  attachButton: {
    marginLeft: 5,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputContainer: {
    height: 40,
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 10,
    marginTop: 5,
    // marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 0,
  },
  input: {
    flex: 1,
    height: 40,
    color: TEXT_INPUT,
  },
  sendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
  },
  sendIcon: {
    color: PRIMARY,
  },
});

type Props = {
  navigation: StackNavigationProp<MessagesStackParamList, 'Message'>;
  route: Route;
};

const MessageScreen: React.FC<Props> = ({ navigation, route }) => {
  const [messageText, setMessageText] = useState(''),
    // A semaphore to prevent multiple of messages pages from loading simultaneously.
    [isLoadingNext, setIsLoadingNext] = useState(false),
    [isProcessing, setProcessing] = useState(false);

  let room: RoomFieldsInterface = route.params.room;
  const roomId = room ? room.roomId : route.params.roomId;

  const roomQuery = useQuery<RoomQuery, RoomQueryVariables>(ROOM_QUERY, {
    variables: {
      roomId: route.params.roomId,
    },
    skip: room !== undefined,
  });

  if (!roomQuery.loading && !roomQuery.error && roomQuery.data) {
    room = roomQuery.data.room;
  }

  // query messages
  const { loading, error, data, fetchMore } = useQuery<
    MessagesQueryInterface,
    MessageQueryVariables
  >(MESSAGES_QUERY, {
    variables: { roomId, after: null },
  });

  useEffect(() => {
    if (!room) {
      return;
    }

    // set header title
    navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerTitle: () => (
        <Header
          style={{ marginLeft: -15 }}
          title={room.name}
          picture={room.picture}
        />
      ),
    });
  }, [room, navigation]);

  useEffect(() => {
    if (!room || loading) {
      // Wait until after the messages are done loading so that we have them to be able
      // to set the most recently read message.
      return;
    }
    if (room.qtyUnread > 0) {
      markAllRead(room.roomId, true);
    }
  }, [room, loading]);

  if (loading || !data || roomQuery.loading) {
    return <Loading />;
  }

  if (roomQuery.error) {
    return <Error error={roomQuery.error} />;
  }
  if (error) {
    return <Error error={error} />;
  }

  const handleEndReach = async (): Promise<void> => {
    if (isLoadingNext) {
      return;
    }
    setIsLoadingNext(true);

    const variables: MessageQueryVariables = {
      roomId: room.roomId,
      after: data.messages.pageInfo.endCursor,
    };

    await fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        setIsLoadingNext(false);
        if (!fetchMoreResult || fetchMoreResult.messages.data.length === 0) {
          return prev;
        }
        return {
          messages: {
            data: [...prev.messages.data, ...fetchMoreResult.messages.data],
            pageInfo: fetchMoreResult.messages.pageInfo,
          },
        };
      },
    });
  };

  // handle message send
  const handleSend = async (): Promise<void> => {
    if (messageText.length === 0) {
      return;
    }
    const body = messageText;
    setMessageText('');
    await sendMessage(room.roomId, body);
  };

  function handleMessageChange(text: string): void {
    setMessageText(text);
  }

  async function handleAssetSend(asset: AssetInterface): Promise<void> {
    setProcessing(true);
    const body = messageText;
    setMessageText('');
    await sendMessage(room.roomId, body, asset);
    setProcessing(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 85}
    >
      <View style={styles.messages}>
        <FlatList
          ListFooterComponent={
            <BeginningOfConversation loading={isLoadingNext} />
          }
          onEndReached={handleEndReach}
          data={data.messages.data}
          renderItem={({ item }) => (
            <Message key={item.messageId} messageData={item} room={room} />
          )}
          keyExtractor={(item) => item.messageId}
          inverted
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.attachButton}>
          <Attach
            onSend={handleAssetSend}
            room={room}
            setProcessing={setProcessing}
            disabled={!!messageText}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={handleMessageChange}
            placeholder="Aa"
            style={styles.input}
            placeholderTextColor={PLACEHOLDER_TEXT}
            value={messageText}
          />

          <ActionButton
            room={room}
            hasText={messageText.length > 0}
            onSend={handleSend}
            onRecordingSend={handleAssetSend}
            isProcessing={isProcessing}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen;
