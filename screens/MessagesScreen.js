import React from 'react'
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
// queries
import { ROOMS_QUERY } from '../gql/MessageQuery'
// components
import MessageItem from '../components/MessageItem'

function MessagesScreen({ navigation }) {
  const { loading, error, data } = useQuery(ROOMS_QUERY);

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
