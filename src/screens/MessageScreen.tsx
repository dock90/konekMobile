import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Route,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client';
import Error from '../components/Error';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { MeContext } from '../contexts/MeContext';
import { MeFieldsInterface } from '../queries/MeQueries';
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
import { uploadFile } from '../service/Cloudinary';
import { markAllRead, sendMessage } from '../service/Messages';
import { Recorder } from '../service/Recorder';
import { PRIMARY } from '../styles/Colors';
import { MessagesStackParamList } from './MessagesStackScreen';
import BeginningOfConversation from './MessageScreen/BeginningOfConversation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  messages: {
    flex: 1,
  },
  inputContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 15,
    paddingLeft: 12,
    paddingRight: 0,
  },
  input: {
    flex: 1,
    height: 40,
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

const MODE_READY = 'ready';
const MODE_SEND = 'send';
const MODE_RECORDING = 'recording';
const MODE_PROCESSING = 'proc';
let DEFAULT_MODE = MODE_READY;

let permissionDenied = false;
Recorder.isPermissionDenied().then((denied) => {
  permissionDenied = denied;
});

type Props = {
  navigation: StackNavigationProp<MessagesStackParamList, 'Message'>;
  route: Route;
};

const MessageScreen: React.FC<Props> = ({ navigation, route }) => {
  const { cloudinaryInfo } = useContext(MeContext) as MeFieldsInterface;
  const [messageText, setMessageText] = useState('');
  // A semaphore to prevent multiple of messages pages from loading simultaneously.
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [actionMode, setActionMode] = useState(DEFAULT_MODE);
  const [recording, setRecording] = useState<null | Recorder>(null);

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

  useEffect(() => {
    if (permissionDenied) {
      // If the permission is denied, we want to set the mode to send so the
      // record icon is never shown.
      DEFAULT_MODE = MODE_SEND;
      if (actionMode === MODE_READY) {
        // If we were previously "ready", we should set to the default mode.
        setActionMode(DEFAULT_MODE);
      }
    } else {
      DEFAULT_MODE = MODE_READY;
    }
  }, [actionMode]);

  if (loading || !data || roomQuery.loading) {
    return <Loading />;
  }

  if (roomQuery.error) {
    return <Error error={roomQuery.error} />;
  }
  if (error) {
    return <Error error={error} />;
  }

  const handleEndReach = async () => {
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
  const handleActionExecute = async () => {
    if (messageText.length === 0) {
      return;
    }
    const body = messageText;
    setMessageText('');
    setActionMode(MODE_PROCESSING);
    await sendMessage(room.roomId, body);
    setActionMode(DEFAULT_MODE);
  };
  function handleMessageChange(text: string) {
    setMessageText(text);
    if (text.length > 0) {
      setActionMode(MODE_SEND);
    } else {
      setActionMode(MODE_READY);
    }
  }
  async function handlePressIn() {
    if (actionMode !== DEFAULT_MODE) {
      return;
    }
    setActionMode(MODE_PROCESSING);
    const r = new Recorder();

    const isRecording = await r.start();
    if (isRecording) {
      setRecording(r);
      setActionMode(MODE_RECORDING);
    } else {
      setActionMode(DEFAULT_MODE);
    }
  }
  async function handlePressOut() {
    console.log('OUT');
    if (!recording) {
      return;
    }

    await recording.stop();
    setActionMode(MODE_PROCESSING);

    const file = await recording.getFile();

    if (file) {
      const upload = await uploadFile(
        {
          folder: room.roomId,
          apiKey: cloudinaryInfo.apiKey,
          cloudName: cloudinaryInfo.cloudName,
          resourceType: 'video',
          tags: ['recording', room.roomId],
        },
        file
      );
      await sendMessage(room.roomId, '', upload);
    }
    setRecording(null);
    setActionMode(DEFAULT_MODE);
  }

  let actionIcon = 'send';
  switch (actionMode) {
    case MODE_RECORDING:
      actionIcon = 'adjust';
      break;
    case MODE_READY:
      actionIcon = 'mic';
      break;
  }

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 85}
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
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={handleMessageChange}
          placeholder="Aa"
          style={styles.input}
          value={messageText}
          editable={actionMode !== MODE_RECORDING}
        />

        <TouchableOpacity
          onPress={handleActionExecute}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.sendContainer}
        >
          {actionMode === MODE_PROCESSING ? (
            <ActivityIndicator size={20} color={PRIMARY} />
          ) : (
            <MaterialIcons
              name={actionIcon}
              style={styles.sendIcon}
              size={20}
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen;
