import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RoomFieldsInterface } from '../queries/RoomQueries';
import { MessagesStackParamList } from '../screens/MessagesStackScreen';
import { BORDER } from '../styles/Colors';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: 70,
    borderStyle: 'solid',
    borderBottomWidth: 0.5,
    borderColor: BORDER,
  },
  messageContact: {
    fontSize: 12,
    fontWeight: 'bold',
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
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: room.qtyUnread ? '#F5F5F5' : '#FFFFFF' },
      ]}
      onPress={handleSelect}
    >
      <Avatar style={{ marginRight: 20 }} picture={room.picture} />
      <Text style={styles.messageContact}>{room.name}</Text>
    </TouchableOpacity>
  );
};

export default RoomItem;
