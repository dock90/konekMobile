import React from 'react'
import { View, StyleSheet } from 'react-native';
// components
import Header from '../components/Header'

function ContactsScreen() {
  return (
    <View style={styles.container}>
      <Header title="Contacts" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default ContactsScreen
