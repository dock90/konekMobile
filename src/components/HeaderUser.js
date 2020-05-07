import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
// gql
import { ROOM_QUERY } from '../gql/RoomQueries';

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
    // TODO: render ghost image while loading
    return null;
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>There was an error:</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const {
    room: { picture },
  } = data;

  let url =
    'https://image.freepik.com/free-icon/important-person_318-10744.jpg';
  if (picture) {
    const { format, publicId } = picture;
    const cloudName = 'equiptercrm';
    url =
      `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.${format}` ||
      '';
  }

  return (
    <View style={styles.container}>
      <Image style={styles.roomPicture} source={{ url: url }} />
      <Text style={styles.roomName}>{name}</Text>
    </View>
  );
}

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
    borderRadius: 50,
    marginRight: 10,
  },
  roomName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HeaderUser;
