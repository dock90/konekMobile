import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Route,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client';
import Error from '../components/Error';
import Header from '../components/Header';
import Loading from '../components/Loading';
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
import { sendMessage } from '../service/Messages';
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
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  input: {
    height: 40,
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendIcon: {
    marginRight: 5,
    color: PRIMARY,
  },
  sendText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: PRIMARY,
  },
});

type Props = {
  navigation: StackNavigationProp<MessagesStackParamList, 'Message'>;
  route: Route;
};

const MessageScreen: React.FC<Props> = ({ navigation, route }) => {
  const [pendingMessage, setPendingMessage] = useState('');
  const [viewHeight, setViewHeight] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

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

  if (loading || !data || roomQuery.loading) {
    return <Loading />;
  }

  if (roomQuery.error) {
    return <Error error={roomQuery.error} />;
  }
  if (error) {
    return <Error error={error} />;
  }

  const handleEndReach = async ({
    distanceFromEnd,
  }: {
    distanceFromEnd: number;
  }) => {
    if (isLoadingNext) {
      return;
    }
    setIsLoadingNext(true);

    console.log(distanceFromEnd);
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
  const handleSendMessage = async () => {
    const body = pendingMessage;
    setPendingMessage('');
    await sendMessage(room.roomId, body);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
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
      <View
        style={[styles.inputContainer, { marginBottom: viewHeight ? 75 : 20 }]}
      >
        <TextInput
          onBlur={() => setViewHeight(false)}
          onFocus={() => setViewHeight(true)}
          onChangeText={(text) => setPendingMessage(text)}
          placeholder="Aa"
          style={styles.input}
          value={pendingMessage}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={styles.sendContainer}
        >
          <MaterialIcons name="send" style={styles.sendIcon} />
          <Text style={styles.sendText}>send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen;
