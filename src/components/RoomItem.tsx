import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RoomFieldsInterface } from '../queries/RoomQueries';
import { MessagesStackParamList } from '../screens/MessagesStackScreen';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: 75,
    borderStyle: 'solid',
    borderBottomWidth: 0.2,
    borderColor: '#606060',
  },
  messageContact: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

type Props = {
  messageData: RoomFieldsInterface;
  navigation: StackNavigationProp<MessagesStackParamList, 'Rooms'>;
};

const RoomItem: React.FC<Props> = ({ messageData, navigation }) => {
  const { roomId, name } = messageData;

  const handleSelect = () => {
    navigation.navigate('Message', {
      name,
      roomId,
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: messageData.qtyUnread ? '#F5F5F5' : '#FFFFFF' },
      ]}
      onPress={handleSelect}
    >
      <Avatar style={{ marginRight: 20 }} picture={messageData.picture} />
      <View>
        <Text style={styles.messageContact}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RoomItem;
