import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import { ROOM_QUERY } from '../queries/RoomQueries';
import Loading from './Loading';
import Error from './Error';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: -10,
  },
  roomPicture: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  roomName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

function HeaderUser({ route }) {
  const {
    params: { name, roomId },
  } = route;

  const { data, error, loading } = useQuery(ROOM_QUERY, {
    variables: {
      roomId,
    },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <View style={styles.container}>
      <Avatar picture={data.room.picture} style={styles.roomPicture} />
      <Text style={styles.roomName}>{name}</Text>
    </View>
  );
}

export default HeaderUser;
