import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, View, Text, TextInput } from 'react-native';
import { auth } from '../config/firebase';

function SignupScreen({ navigation }) {
  const [firstName, onChangeFirstName] = useState('');
  const [lastName, onChangeLastName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  const handleSignup = () => {
    email.length > 0 && password.length > 0
      ? auth
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            console.log('Signup Success');
          })
          .catch((error) => {
            console.log('Signup Error: ', error);
          })
      : console.log('TOO BAD SAUSAGE');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Signup</Text>
      <TextInput
        onChangeText={(text) => onChangeFirstName(text)}
        placeholder="First Name"
        value={firstName}
      />
      <TextInput
        onChangeText={(text) => onChangeLastName(text)}
        placeholder="Last Name"
        value={lastName}
      />
      <TextInput
        keyboardType="email-address"
        onChangeText={(text) => onChangeEmail(text)}
        placeholder="Email"
        textContentType="emailAddress"
        value={email}
      />
      <TextInput
        onChangeText={(text) => onChangePassword(text)}
        placeholder="Password"
        secureTextEntry
        textContentType="newPassword"
        value={password}
      />
      <Button onPress={handleSignup} title="Sign Up" />
      <Button
        title="Have an account?"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

SignupScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default SignupScreen;
