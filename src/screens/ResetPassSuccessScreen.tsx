import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthStack } from '../components/AuthContainer';
import { ButtonStyles } from '../styles/ButtonStyles';
import { ContainerStyles } from '../styles/ContainerStyles';
import { TextStyles } from '../styles/TextStyles';

type Props = {
  navigation: StackNavigationProp<AuthStack>;
};

const ResetPassSuccessScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View
      style={[ContainerStyles.baseContainer, ContainerStyles.textContainer]}
    >
      <Text style={{ textAlign: 'center', marginBottom: 25 }}>
        Check your email to finish the password reset process.
      </Text>
      <TouchableOpacity
        style={ButtonStyles.baseButton}
        onPress={() => {
          navigation.navigate('Login');
        }}
      >
        <Text style={TextStyles.button}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassSuccessScreen;
