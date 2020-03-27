import React, { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useQuery, useMutation } from '@apollo/client';
// queries
import { MESSAGES_QUERY, SEND_MESSAGE_MUTATION } from '../gql/MessageQueries'
// components
import Message from '../components/Message'

function MessageScreen({ navigation, route }) {
  const [pendingMessage, onChangeText] = useState('');
  const { name, roomId } = route.params

  // set header title
  navigation.setOptions({
    title: name
  });

  // query messages
  const { loading, error, data } = useQuery(MESSAGES_QUERY, {
    variables: { roomId },
    skip: !roomId,
    pollInterval: 500
  });

  // send message mutation
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

  // handle message send
  const handleSendMessage = () => {
    sendMessage({
      variables: {
        roomId,
        body: pendingMessage
      }
    });
    onChangeText('')
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#323232" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>There was an error:</Text>
        <Text>{error.message}</Text>
      </View>
    )
  }

  const { messages } = data

  return (
    <KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.messages}>
        <FlatList
          data={messages.data}
          renderItem={({ item }) => (
            <Message
              key={item.messageId}
              messageData={item}
            />
          )
          }
          keyExtractor={item => item.messageId}
          inverted
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => onChangeText(text)}
          value={pendingMessage}
        />
        <Button
          onPress={handleSendMessage}
          title="Send"
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  messages: {
    maxHeight: '90%',
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'gray',
  },
  input: {
    flex: 1,
    height: 40,
  },
})

export default MessageScreen
