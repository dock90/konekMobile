import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useQtyUnread } from '../../hooks/useQtyUnread';
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
    // so that it stays round, but can grow with longer numbers.
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
  const qtyUnread = useQtyUnread();

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
