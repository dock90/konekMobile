import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  pathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    marginRight: 10,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

type Props = {
  title: string;
};

const Header: React.FC<Props> = ({ title }) => (
  <View style={styles.container}>
    <View style={styles.pathContainer}>
      <Text style={styles.pathTitle}>{title}</Text>
    </View>
  </View>
);

export default Header;
