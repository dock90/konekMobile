import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RoomFieldsInterface } from '../queries/RoomQueries';
import { MessagesStackParamList } from '../screens/MessagesStackScreen';
import { BACKGROUND, PRIMARY, TEXT_ON_PRIMARY } from '../styles/Colors';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: 70,
    backgroundColor: BACKGROUND,
  },
  roomName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  unreadContainer: {
    position: 'absolute',
    top: 0,
    right: -5,
    backgroundColor: PRIMARY,
    // so that it stays round, but can grow with longer numbers.
    minWidth: 17,
    height: 17,
    borderRadius: 10,
    borderColor: BACKGROUND,
    borderWidth: StyleSheet.hairlineWidth,
    paddingLeft: 4,
    paddingRight: 4,
    display: 'flex',
    justifyContent: 'center',
  },
  unreadText: {
    color: TEXT_ON_PRIMARY,
    textAlign: 'center',
    fontSize: 10,
  },
});

type Props = {
  room: RoomFieldsInterface;
  navigation: StackNavigationProp<MessagesStackParamList, 'Rooms'>;
};

const RoomItem: React.FC<Props> = ({ room, navigation }) => {
  const handleSelect = () => {
    navigation.navigate('Message', { room });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleSelect}>
      <View style={{ marginRight: 20, position: 'relative' }}>
        <Avatar picture={room.picture} overlayColor={BACKGROUND} />
        {room.qtyUnread > 0 && (
          <View style={styles.unreadContainer}>
            <Text style={styles.unreadText}>{room.qtyUnread}</Text>
          </View>
        )}
      </View>
      <Text style={styles.roomName}>{room.name}</Text>
    </TouchableOpacity>
  );
};

export default RoomItem;
