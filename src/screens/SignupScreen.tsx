import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { auth } from '../config/firebase';
import { FIELD_REQUIRED, INVALID_EMAIL } from '../config/Messages';
import { isEmailValid } from '../service/Validation';
import { ButtonStyles } from '../styles/ButtonStyles';
import logo from '../../assets/coloredLogo3x.png';
import { PLACEHOLDER_TEXT } from '../styles/Colors';
import { ContainerStyles } from '../styles/ContainerStyles';
import { InputStyles } from '../styles/InputStyles';
import { LogoStyles } from '../styles/LogoStyles';
import { TextStyles } from '../styles/TextStyles';

const SignupScreen: React.FC = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  function handleChange(field: string, value: string): void {
    setState({
      ...state,
      [field]: value,
    });
    setErrors({
      ...errors,
      [field]: '',
    });
  }

  const handleSignup = async () => {
    if (!state.name) {
      setErrors({ ...errors, name: FIELD_REQUIRED });
      return;
    }
    if (!state.email) {
      setErrors({ ...errors, email: FIELD_REQUIRED });
      return;
    } else if (!isEmailValid(state.email)) {
      setErrors({ ...errors, email: INVALID_EMAIL });
      return;
    }

    if (!state.password) {
      setErrors({ ...errors, password: FIELD_REQUIRED });
      return;
    }

    try {
      await auth.createUserWithEmailAndPassword(state.email, state.password);
    } catch (e) {
      setErrors({
        ...errors,
        password: e.messages,
      });
      return;
    }

    try {
      await auth.currentUser?.updateProfile({
        displayName: state.name,
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  };

  return (
    <View style={ContainerStyles.baseContainer}>
      <Image
        source={logo}
        style={[LogoStyles.fullSize, { marginBottom: 80 }]}
      />
      {!!errors.name && <Text style={TextStyles.error}>{errors.name}</Text>}
      <TextInput
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Name"
        value={state.name}
        textContentType="name"
        style={[InputStyles.base, errors.name ? InputStyles.error : null]}
        placeholderTextColor={PLACEHOLDER_TEXT}
      />
      {!!errors.email && <Text style={TextStyles.error}>{errors.email}</Text>}
      <TextInput
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}
        placeholder="Email"
        textContentType="emailAddress"
        value={state.email}
        style={[InputStyles.base, errors.email ? InputStyles.error : null]}
        placeholderTextColor={PLACEHOLDER_TEXT}
      />
      {!!errors.password && (
        <Text style={TextStyles.error}>{errors.password}</Text>
      )}
      <TextInput
        onChangeText={(text) => handleChange('password', text)}
        placeholder="Password"
        secureTextEntry
        textContentType="newPassword"
        value={state.password}
        style={[InputStyles.base, errors.password ? InputStyles.error : null]}
        placeholderTextColor={PLACEHOLDER_TEXT}
      />
      <TouchableOpacity style={ButtonStyles.baseButton} onPress={handleSignup}>
        <Text style={TextStyles.button}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
