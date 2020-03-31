import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import coloredLogo3x from '../assets/coloredLogo3x.png'

function ResetPassScreen({ navigation }) {
  const [email, onChangeEmail] = useState('');

  const handleResetPass = () => {
    navigation.navigate('ResetPassSuccessScreen')
  }

  return (
    <View style={styles.container}>
      <Image
        source={coloredLogo3x}
        style={styles.logo}
      />
      <Text style={styles.text}>Forgot your password?</Text>
      <TextInput
        keyboardType="email-address"
        onChangeText={text => onChangeEmail(text)}
        placeholder="Email"
        style={styles.input}
        textContentType="emailAddress"
        value={email}
      />
      <TouchableOpacity
        onPress={handleResetPass}
        style={styles.resetContainer}
      >
        <Text style={styles.resetText}>send reset email</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 153,
    height: 36,
    marginBottom: 80
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30
  },
  input: {
    // width: '70%',
    width: 240,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#606060',
    borderRadius: 3,
    padding: 10,
    marginBottom: 20,
    fontSize: 12
  },
  resetContainer: {
    // width: '70%',
    width: 240,
    height: 40,
    backgroundColor: '#5D00D8',
    borderRadius: 3,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 12,
    textTransform: 'uppercase'
  },
})

export default ResetPassScreen
