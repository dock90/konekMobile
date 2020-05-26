import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthStack } from '../components/AuthContainer';
import { auth } from '../config/firebase';
import coloredLogo3x from '../../assets/coloredLogo3x.png';
import { ContainerStyles } from '../styles/ContainerStyles';
import { InputStyles } from '../styles/InputStyles';
import { LogoStyles } from '../styles/LogoStyles';
import { TextStyles } from '../styles/TextStyles';
import { ButtonStyles } from '../styles/ButtonStyles';

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  resetPasswordContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {
  navigation: StackNavigationProp<AuthStack>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    // reset error states
    setEmailError('');
    setPasswordError('');

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

  const disabled = !email || !password;

  return (
    <View style={ContainerStyles.baseContainer}>
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
        {!!emailError && <Text style={TextStyles.error}>{emailError}</Text>}
        <TextInput
          onChangeText={(text) => onChangePassword(text)}
          placeholder="Password"
          secureTextEntry
          style={InputStyles.base}
          textContentType="password"
          value={password}
        />
        {!!passwordError && (
          <Text style={TextStyles.error}>{passwordError}</Text>
        )}
      </View>
      <TouchableOpacity
        disabled={disabled}
        onPress={handleLogin}
        style={[
          ButtonStyles.baseButton,
          disabled ? ButtonStyles.disabledButton : null,
        ]}
      >
        <Text style={TextStyles.button}>login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ResetPass')}
        style={styles.resetPasswordContainer}
      >
        <Text style={TextStyles.link}>Forgot Your Password?</Text>
      </TouchableOpacity>
      <TouchableHighlight
        onPress={() => navigation.navigate('Signup')}
        style={styles.resetPasswordContainer}
      >
        <Text style={TextStyles.link}>Need an account?</Text>
      </TouchableHighlight>
    </View>
  );
};

export default LoginScreen;
