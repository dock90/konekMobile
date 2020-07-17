import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { MessageFieldsInterface } from '../queries/MessageQueries';
import { RoomFieldsInterface } from '../queries/RoomQueries';
import { PRIMARY, SECONDARY, TEXT_ON_PRIMARY } from '../styles/Colors';
import formatDateTime from '../utils/formatDate';
import Asset from './Asset';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    padding: 3,
    borderRadius: 6,
  },
  profileImg: {
    marginRight: 5,
  },
  contactName: {
    fontSize: 9,
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    padding: 10,
    color: TEXT_ON_PRIMARY,
  },
  timestamp: {
    fontSize: 9,
    marginBottom: 3,
  },
});

type Props = {
  messageData: MessageFieldsInterface;
  room: RoomFieldsInterface;
};

const Message: React.FC<Props> = ({ messageData, room }) => {
  const notMe = messageData.author.memberId !== room.memberId;

  const onLongPress = () => {
    if (!messageData.body) {
      return;
    }
    try {
      Clipboard.setString(messageData.body);
    } catch (e) {
      // In case the clipboard module hasn't been installed yet.
    }
  };

  return (
    <TouchableWithoutFeedback onLongPress={onLongPress}>
      <View
        style={[
          styles.container,
          { justifyContent: notMe ? 'flex-start' : 'flex-end' },
        ]}
      >
        {notMe && (
          <Avatar
            picture={messageData.author.picture}
            size={25}
            style={styles.profileImg}
          />
        )}
        <View style={{ flex: 1 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: notMe ? 'flex-start' : 'flex-end',
            }}
          >
            {notMe && (
              <Text style={styles.contactName}>
                {messageData.author.name} -{' '}
              </Text>
            )}
            <Text style={styles.timestamp}>
              {formatDateTime(messageData.createdAt)}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: notMe ? SECONDARY : PRIMARY,
              borderRadius: 5,
              alignSelf: notMe ? 'flex-start' : 'flex-end',
            }}
          >
            {messageData.asset && (
              <Asset asset={messageData.asset} textColor="#fff" />
            )}
            {!!messageData.body && (
              <Text style={styles.message}>{messageData.body}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Message;
