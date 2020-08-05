import { useQuery } from '@apollo/client';
import React, { useMemo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { ROOMS_QUERY, RoomsQuery } from '../../queries/RoomQueries';
import { BACKGROUND, PRIMARY, TEXT_ON_PRIMARY } from '../../styles/Colors';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  unreadContainer: {
    position: 'absolute',
    top: -3,
    right: -10,
    backgroundColor: PRIMARY,
    minWidth: 17,
    height: 17,
    borderRadius: 10,
    borderColor: BACKGROUND,
    borderWidth: StyleSheet.hairlineWidth,
    paddingRight: 4,
    paddingLeft: 4,
    display: 'flex',
    justifyContent: 'center',
  },
  unreadText: {
    color: TEXT_ON_PRIMARY,
    textAlign: 'center',
    fontSize: 10,
  },
});

interface Props {
  color: string;
  size: number;
}

const MessagesTabIcon: React.FC<Props> = ({ size, color }) => {
  const { loading, data, error } = useQuery<RoomsQuery>(ROOMS_QUERY);

  const qtyUnread: number = useMemo(() => {
    if (loading || error || !data || data.rooms.length == 0) {
      return 0;
    }

    let unread = 0;

    data.rooms.forEach((r) => {
      unread += r.qtyUnread;
    });

    return unread;
  }, [loading, data, error]);

  return (
    <View style={styles.container}>
      <MaterialIcons name="chat" size={size} color={color} />
      {qtyUnread > 0 && (
        <View style={styles.unreadContainer}>
          <Text style={styles.unreadText}>{qtyUnread}</Text>
        </View>
      )}
    </View>
  );
};

export default MessagesTabIcon;
