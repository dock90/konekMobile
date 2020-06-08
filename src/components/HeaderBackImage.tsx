import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  backContainer: {
    width: 60,
    height: 40,
    marginBottom: 10,
    marginLeft: 15,
  },
  backIcon: {
    fontSize: 25,
    paddingLeft: 0,
    paddingTop: 10,
  },
});

const HeaderBackImage: React.FC = () => (
  <TouchableOpacity style={styles.backContainer}>
    <MaterialIcons name="arrow-back" style={styles.backIcon} />
  </TouchableOpacity>
);

export default HeaderBackImage;
