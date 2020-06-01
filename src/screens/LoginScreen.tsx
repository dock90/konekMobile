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
import Loading from '../components/Loading';
import { auth } from '../config/firebase';
import coloredLogo3x from '../../assets/coloredLogo3x.png';
import { INVALID_EMAIL, INVALID_PASSWORD } from '../config/Messages';
import { ContainerStyles } from '../styles/ContainerStyles';
import { InputStyles } from '../styles/InputStyles';
import { LogoStyles } from '../styles/LogoStyles';
import { TextStyles } from '../styles/TextStyles';
import { ButtonStyles } from '../styles/ButtonStyles';

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    alignItems: 'center',
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
  const [processing, setProcessing] = useState(false);
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async (): Promise<void> => {
    if (processing) {
      return;
    }
    // reset error states
    setProcessing(true);
    setEmailError('');
    setPasswordError('');

    // handle authentication
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-email') {
        setEmailError(INVALID_EMAIL);
      }
      if (errorCode === 'auth/wrong-password') {
        setPasswordError(INVALID_PASSWORD);
      } else {
        setEmailError(error.message);
        console.log(error);
      }
    }
    setProcessing(false);
  };

  const disabled = !email || !password || processing;

  return (
    <View style={ContainerStyles.baseContainer}>
      <Image
        source={coloredLogo3x}
        style={[LogoStyles.fullSize, { marginBottom: 20 }]}
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
        {!processing && <Text style={TextStyles.button}>login</Text>}
        {processing && <Loading size={20} color="white" />}
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
