import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import coloredLogo3x from '../../assets/coloredLogo3x.png';
import { LogoStyles } from '../styles/LogoStyles';
import { InputStyles } from '../styles/InputStyles';
import { TextStyles } from '../styles/TextStyles';
import { ButtonStyles } from '../styles/ButtonStyles';
import { ContainerStyles } from '../styles/ContainerStyles';

function ResetPassScreen({ navigation }) {
  const [email, onChangeEmail] = useState('');

  const handleResetPass = () => {
    navigation.navigate('ResetPassSuccessScreen');
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
}

ResetPassScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default ResetPassScreen;
