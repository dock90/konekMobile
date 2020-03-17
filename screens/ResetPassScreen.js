import React, { useState } from 'react'
import { Button, View, Text, TextInput } from 'react-native';

function ResetPassScreen({ navigation }) {
  const [email, onChangeEmail] = useState('');

  const handleResetPass = () => {
    navigation.navigate('ResetPassSuccess')
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Reset Password</Text>
      <Text>Forgot your password? No problem!</Text>
      <TextInput
        keyboardType="email-address"
        onChangeText={text => onChangeEmail(text)}
        placeholder="Email"
        textContentType="emailAddress"
        value={email}
      />
      <Button
        onPress={handleResetPass}
        title="Reset Password"
      />
    </View>
  )
}

export default ResetPassScreen
