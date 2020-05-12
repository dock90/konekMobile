import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RoomFieldsInterface } from '../queries/RoomQueries';
import { MessagesStackParamList } from '../screens/MessagesStackScreen';

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
  messageImage: {
    height: 45,
    width: 45,
    borderRadius: 50,
    marginRight: 20,
  },
  messageOverview: {},
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
  const { roomId, name, picture, qtyUnread } = messageData;

  const handleSelect = () => {
    navigation.navigate('Message', {
      name,
      roomId,
    });
  };

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
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: qtyUnread ? '#F5F5F5' : '#FFFFFF' },
      ]}
      onPress={handleSelect}
    >
      <Image style={styles.messageImage} source={{ uri: url }} />
      <View style={styles.messageOverview}>
        <Text style={styles.messageContact}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RoomItem;
