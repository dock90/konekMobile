import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView } from 'react-native';
import AcceptInvitation from '../../components/AcceptInvitation';
import { ContainerStyles } from '../../styles/ContainerStyles';
import { ProfileStackParamList } from './ProfileStackScreen';

interface Props {
  navigation: StackNavigationProp<ProfileStackParamList>;
}

const InvitationScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView style={ContainerStyles.baseContainer}>
      <AcceptInvitation />
    </SafeAreaView>
  );
};

export default InvitationScreen;
