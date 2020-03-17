import React, { useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native';
import { auth } from '../config/firebase'

function LoginScreen({ navigation }) {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login</Text>
      <TextInput
        keyboardType="email-address"
        onChangeText={text => onChangeEmail(text)}
        placeholder="Email"
        textContentType="emailAddress"
        value={email}
      />
      <TextInput
        onChangeText={text => onChangePassword(text)}
        placeholder="Password"
        secureTextEntry
        textContentType="password"
        value={password}
      />
      <Button
        onPress={handleLogin}
        title="Login"
      />
      <Button
        title="Need an account?"
        onPress={() => navigation.navigate('Signup')}
      />
      <Button
        title="Forgot password?"
        onPress={() => navigation.navigate('ResetPass')}
      />
    </View>
  )
}

export default LoginScreen
