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
import { RoomFieldsInterface } from '../queries/RoomQueries';
import { sendMessage } from '../service/Messages';
import { PRIMARY } from '../styles/Colors';
import { MessagesStackParamList } from './MessagesStackScreen';

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
    marginBottom: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  input: {
    flex: 1,
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

  const room: RoomFieldsInterface = route.params.room;

  // query messages
  const { loading, error, data } = useQuery<
    MessagesQueryInterface,
    MessageQueryVariables
  >(MESSAGES_QUERY, {
    variables: { roomId: room.roomId, after: null },
  });

  useEffect(() => {
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
  }, [room]);

  // handle message send
  const handleSendMessage = async () => {
    const body = pendingMessage;
    setPendingMessage('');
    await sendMessage(room.roomId, body);
  };

  if (loading || !data) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.messages}>
        <FlatList
          data={data.messages.data}
          renderItem={({ item }) => (
            <Message key={item.messageId} messageData={item} />
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
