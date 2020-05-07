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
import { InputStyles } from '../styles/InputStyles';
import { LogoStyles } from '../styles/LogoStyles';
import { TextStyles } from '../styles/TextStyles';
import { ButtonStyles } from '../styles/ButtonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  resetPasswordContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

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
      <Image
        source={coloredLogo3x}
        style={[LogoStyles.fullSize, { marginBottom: 80 }]}
      />
      <View style={styles.inputContainer}>
        <TextInput
          keyboardType="email-address"
          onChangeText={(text) => onChangeEmail(text)}
          placeholder="Email"
          style={InputStyles.base}
          textContentType="emailAddress"
          value={email}
        />
        {emailError && <Text style={TextStyles.error}>{emailError}</Text>}
        <TextInput
          onChangeText={(text) => onChangePassword(text)}
          placeholder="Password"
          secureTextEntry
          style={InputStyles.base}
          textContentType="password"
          value={password}
        />
        {passwordError && <Text style={TextStyles.error}>{passwordError}</Text>}
      </View>
      <TouchableOpacity onPress={handleLogin} style={ButtonStyles.baseButton}>
        <Text style={TextStyles.button}>login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ResetPass')}
        style={styles.resetPasswordContainer}
      >
        <Text style={TextStyles.link}>Forgot Your Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen;
