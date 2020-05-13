import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MessageFieldsInterface } from '../queries/MessageQueries';
import { RoomFieldsInterface } from '../queries/RoomQueries';
import formatDateTime from '../utils/formatDate';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 35,
  },
  profileImg: {
    marginRight: 10,
  },
  contactName: {
    fontSize: 8,
    marginBottom: 5,
  },
  message: {
    fontSize: 12,
    padding: 12,
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 8,
    color: '#ADADAD',
  },
});

type Props = {
  messageData: MessageFieldsInterface;
  room: RoomFieldsInterface;
};

const Message: React.FC<Props> = ({ messageData, room }) => {
  const notMe = messageData.author.memberId !== room.memberId;

  return (
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
      <View>
        {notMe && (
          <Text style={styles.contactName}>{messageData.author.name}</Text>
        )}
        <View
          style={{
            backgroundColor: notMe ? '#69B98F' : '#5D00D8',
            borderRadius: 5,
          }}
        >
          <Text style={styles.message}>{messageData.body}</Text>
        </View>
        <Text
          style={[styles.timestamp, { textAlign: notMe ? 'right' : 'left' }]}
        >
          {formatDateTime(messageData.createdAt)}
        </Text>
      </View>
    </View>
  );
};

export default Message;
