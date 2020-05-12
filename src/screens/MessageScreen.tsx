import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Route,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery } from '@apollo/client';
import Error from '../components/Error';
import Loading from '../components/Loading';
import {
  MessageQueryVariables,
  MESSAGES_QUERY,
  MessagesQueryInterface,
} from '../queries/MessageQueries';
import Message from '../components/Message';
import send3x from '../../assets/send3x.png';
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
    height: 10,
    width: 10,
    marginRight: 5,
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
  const { name, roomId } = route.params;

  // set header title
  navigation.setOptions({
    title: name,
  });

  // query messages
  const { loading, error, data } = useQuery<
    MessagesQueryInterface,
    MessageQueryVariables
  >(MESSAGES_QUERY, {
    variables: { roomId, after: null },
    skip: !roomId,
  });

  // handle message send
  const handleSendMessage = async () => {
    const body = pendingMessage;
    setPendingMessage('');
    await sendMessage(roomId, body);
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
          <Image style={styles.sendIcon} source={send3x} />
          <Text style={styles.sendText}>send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen;
