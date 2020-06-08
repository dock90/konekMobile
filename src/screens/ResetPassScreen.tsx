import { StackNavigationProp } from '@react-navigation/stack';
import Loading from '../components/Loading';
import { auth } from '../config/firebase';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import coloredLogo3x from '../../assets/coloredLogo3x.png';
import { AuthStack } from '../components/AuthContainer';
import { PLACEHOLDER_TEXT } from '../styles/Colors';
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
  const [processing, setProcessing] = useState(false);

  const handleResetPass = async () => {
    setProcessing(true);
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (e) {}

    navigation.navigate('ResetPassSuccess');
    setProcessing(false);
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
        placeholderTextColor={PLACEHOLDER_TEXT}
        textContentType="emailAddress"
        value={email}
        editable={!processing}
      />
      <TouchableOpacity
        onPress={handleResetPass}
        disabled={processing}
        style={[
          ButtonStyles.baseButton,
          processing ? ButtonStyles.disabledButton : {},
        ]}
      >
        {!processing && <Text style={TextStyles.button}>send reset email</Text>}
        {processing && <Loading size={20} color="white" />}
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassScreen;
