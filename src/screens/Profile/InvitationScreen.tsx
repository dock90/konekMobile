import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import AcceptInvitation from '../../components/AcceptInvitation';
import { ContainerStyles } from '../../styles/ContainerStyles';
import { ProfileStackParamList } from './ProfileStackScreen';

interface Props {
  navigation: StackNavigationProp<ProfileStackParamList>;
}

const InvitationScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView style={ContainerStyles.baseContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 85}
      >
        <AcceptInvitation />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InvitationScreen;
