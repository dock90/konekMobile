import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase'

import coloredLogo3x from '../assets/coloredLogo3x.png'

function LoginScreen({ navigation }) {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  const handleLogin = () => {
    // TODO: Handle login errors
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => console.log('Authentication Success'))
      .error(() => console.log('Error'))
  }

  return (
    <View style={styles.container}>
      <Image
        source={coloredLogo3x}
        style={styles.logo}
      />
      <View style={styles.inputContainer}>
        <TextInput
          keyboardType="email-address"
          onChangeText={text => onChangeEmail(text)}
          placeholder="Email"
          style={styles.input}
          textContentType="emailAddress"
          value={email}
        />
        <TextInput
          onChangeText={text => onChangePassword(text)}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          textContentType="password"
          value={password}
        />
      </View>
      <TouchableOpacity
        onPress={handleLogin}
        style={styles.loginContainer}
      >
        <Text style={styles.loginText}>login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ResetPass')}
        style={styles.resetPasswordContainer}
      >
        <Text style={styles.resetPassword}>Forgot Your Password?</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 153,
    height: 36,
    marginBottom: 80
  },
  inputContainer: {
    marginBottom: 20
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
    marginBottom: 10,
    fontSize: 12
  },
  loginContainer: {
    // width: '70%',
    width: 240,
    height: 40,
    backgroundColor: '#5D00D8',
    borderRadius: 3,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  resetPasswordContainer: {
    width: 240,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetPassword: {
    color: '#606060'
  }
})

export default LoginScreen
