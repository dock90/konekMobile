import React from 'react'
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';

import group3x from '../assets/group3x.png'

function Header({ title, image }) {
  const url = image ? image : 'https://image.freepik.com/free-icon/important-person_318-10744.jpg'

  return (
    <View style={styles.container}>
      <View style={styles.pathContainer}>
        <Image
          source={{ uri: url }}
          style={styles.profileImage}
        />
        <Text style={styles.pathTitle}>{title}</Text>
      </View>
      <TouchableOpacity>
        <Image
          source={group3x}
          style={styles.menu}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    padding: 20,
    backgroundColor: '#FFFFFF'
  },
  pathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    borderRadius: 50,
    width: 30,
    height: 30,
    marginRight: 10
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  menu: {
    height: 15,
    width: 15,
  }
})

export default Header
