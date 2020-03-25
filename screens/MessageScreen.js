import React from 'react'
import { FlatList, View, Text } from 'react-native'
import { useQuery } from '@apollo/client';
// queries
import { MESSAGES_QUERY } from '../gql/MessageQueries'
// components
import Message from '../components/Message'

function MessageScreen({ navigation, route }) {
  const { name, roomId } = route.params
  navigation.setOptions({
    title: name
  });

  const { loading, error, data } = useQuery(MESSAGES_QUERY, {
    variables: { roomId },
    skip: !roomId
  });

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
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
    <View>
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
      />
    </View>
  )
}

export default MessageScreen
