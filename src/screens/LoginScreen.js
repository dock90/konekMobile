import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../config/firebase';
import coloredLogo3x from '../../assets/coloredLogo3x.png';

function LoginScreen({ navigation }) {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handleLogin = () => {
    // reset error states
    setEmailError(null);
    setPasswordError(null);

    // handle authentication
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-email') {
        setEmailError('You entered an incorrect email.');
      }
      if (errorCode === 'auth/wrong-password') {
        setPasswordError('You entered an incorrect password.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Image source={coloredLogo3x} style={styles.logo} />
      <View style={styles.inputContainer}>
        <TextInput
          keyboardType="email-address"
          onChangeText={(text) => onChangeEmail(text)}
          placeholder="Email"
          style={styles.input}
          textContentType="emailAddress"
          value={email}
        />
        {emailError && <Text style={styles.error}>{emailError}</Text>}
        <TextInput
          onChangeText={(text) => onChangePassword(text)}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          textContentType="password"
          value={password}
        />
        {passwordError && <Text style={styles.error}>{passwordError}</Text>}
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.loginContainer}>
        <Text style={styles.loginText}>login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ResetPass')}
        style={styles.resetPasswordContainer}
      >
        <Text style={styles.resetPassword}>Forgot Your Password?</Text>
      </TouchableOpacity>
    </View>
  );
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
    marginBottom: 80,
  },
  inputContainer: {
    marginBottom: 20,
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
    fontSize: 12,
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
    textTransform: 'uppercase',
  },
  error: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#e83a30',
  },
  resetPasswordContainer: {
    width: 240,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetPassword: {
    color: '#606060',
  },
});

export default LoginScreen;
