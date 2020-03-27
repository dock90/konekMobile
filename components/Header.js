import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

function Header({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    height: 50,
    margin: 10,
  },
  title: {}
})

export default Header
