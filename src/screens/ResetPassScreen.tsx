import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import coloredLogo3x from '../../assets/coloredLogo3x.png';
import { AuthStack } from '../components/AuthContainer';
import { LogoStyles } from '../styles/LogoStyles';
import { InputStyles } from '../styles/InputStyles';
import { TextStyles } from '../styles/TextStyles';
import { ButtonStyles } from '../styles/ButtonStyles';
import { ContainerStyles } from '../styles/ContainerStyles';

type Props = {
  navigation: StackNavigationProp<AuthStack>;
};

const ResetPassScreen: React.FC<Props> = ({ navigation }) => {
  const [email, onChangeEmail] = useState('');

  const handleResetPass = () => {
    navigation.navigate('ResetPassSuccess');
  };
  return (
    <View style={ContainerStyles.baseContainer}>
      <Image
        source={coloredLogo3x}
        style={[LogoStyles.fullSize, { marginBottom: 20 }]}
      />
      <Text style={TextStyles.h1}>Forgot your password?</Text>
      <TextInput
        keyboardType="email-address"
        onChangeText={(text) => onChangeEmail(text)}
        placeholder="Email"
        style={InputStyles.base}
        textContentType="emailAddress"
        value={email}
      />
      <TouchableOpacity
        onPress={handleResetPass}
        style={ButtonStyles.baseButton}
      >
        <Text style={TextStyles.button}>send reset email</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassScreen;
