import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthStack } from '../components/AuthContainer';
import Loading from '../components/Loading';
import { auth } from '../config/firebase';
import coloredLogo3x from '../../assets/coloredLogo3x.png';
import { INVALID_EMAIL, INVALID_PASSWORD } from '../config/Messages';
import { PLACEHOLDER_TEXT } from '../styles/Colors';
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
  linkContainer: {
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

  const handleLogin = useCallback(async (): Promise<void> => {
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
    // setProcessing(false);
  }, [email, password]);

  const disabled = !email || !password || processing;

  return (
    <SafeAreaView style={ContainerStyles.safeAreaViewContainer}>
      <KeyboardAwareScrollView
        style={{ minHeight: '100%' }}
        contentContainerStyle={{
          minHeight: '100%',
        }}
      >
        <View
          style={[
            ContainerStyles.baseContainer,
            { marginTop: 20, marginBottom: 20 },
          ]}
        >
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
              placeholderTextColor={PLACEHOLDER_TEXT}
              textContentType="emailAddress"
              value={email}
            />
            {!!emailError && <Text style={TextStyles.error}>{emailError}</Text>}
            <TextInput
              onChangeText={(text) => onChangePassword(text)}
              placeholder="Password"
              secureTextEntry
              style={InputStyles.base}
              placeholderTextColor={PLACEHOLDER_TEXT}
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
            style={styles.linkContainer}
          >
            <Text style={TextStyles.link}>Forgot Your Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={styles.linkContainer}
          >
            <Text style={TextStyles.link}>Need an account?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
