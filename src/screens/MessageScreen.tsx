import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useQuery, useMutation } from '@apollo/client';
import {
  MESSAGES_QUERY,
  SEND_MESSAGE_MUTATION,
} from '../queries/MessageQueries';
import { ME_QUERY } from '../queries/MeQueries';
import Message from '../components/Message';
import send3x from '../../assets/send3x.png';
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
    color: '#5D00D8',
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

  // query me
  const me = useQuery(ME_QUERY);

  // query messages
  const { loading, error, data } = useQuery(MESSAGES_QUERY, {
    variables: { roomId },
    skip: !roomId,
    pollInterval: 500,
  });

  // send message mutation
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

  // handle message send
  const handleSendMessage = async () => {
    await sendMessage({
      variables: {
        roomId,
        body: pendingMessage,
      },
    });
    setPendingMessage('');
  };

  if (loading || me.loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#323232" />
      </View>
    );
  }

  if (error || me.error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>There was an error:</Text>
        <Text>{error && error.message}</Text>
      </View>
    );
  }

  const { messages } = data;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.messages}>
        <FlatList
          data={messages.data}
          renderItem={({ item }) => (
            <Message key={item.messageId} messageData={item} me={me} />
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
