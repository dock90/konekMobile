import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@apollo/client';
// queries
import { ROOMS_QUERY } from '../gql/RoomQueries'
// components
import MessageItem from '../components/MessageItem'

function MessagesScreen({ navigation }) {
  const { loading, error, data } = useQuery(ROOMS_QUERY, {
    pollInterval: 1000
  });

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

  const { rooms } = data

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        renderItem={({ item }) =>
          <MessageItem
            key={item.roomId}
            messageData={item}
            navigation={navigation}
          />
        }
        keyExtractor={item => item.roomId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default MessagesScreen
