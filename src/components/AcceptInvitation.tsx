import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import {
  ACCEPT_INVITATION_MUTATION,
  AcceptInvitationMutationResult,
} from '../queries/InvitationQueries';
import { ProfileStackParamList } from '../screens/Profile/ProfileStackScreen';
import { ButtonStyles } from '../styles/ButtonStyles';
import { PRIMARY } from '../styles/Colors';
import { TextStyles } from '../styles/TextStyles';
import Input from './Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  codeHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    width: 240,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    paddingLeft: 12,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    height: 40,
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendIcon: {
    color: PRIMARY,
  },
});

function AcceptInvitation() {
  const [error, setError] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [usedClipboard, setUsedClipboard] = useState(false);
  const [acceptInvitation] = useMutation<AcceptInvitationMutationResult>(
    ACCEPT_INVITATION_MUTATION
  );
  const navigation = useNavigation<
    StackNavigationProp<ProfileStackParamList>
  >();

  useEffect(() => {
    try {
      Clipboard.getString().then((text) => {
        if (text && text.length < 25) {
          setInviteCode(text);
          setUsedClipboard(true);
        }
      });
    } catch (e) {
      // in case the Clipboard module isn't installed.
    }
  }, []);

  const handleAcceptInvitation = async (): Promise<void> => {
    setProcessing(true);
    setError('');
    const { data } = await acceptInvitation({
      variables: {
        code: inviteCode,
      },
    });
    if (!data || !data.acceptInvitation) {
      setProcessing(false);
      setError('Invalid invitation code!');
      return;
    }
    if (usedClipboard) {
      Clipboard.setString('');
    }
    navigation.navigate('Profile');
  };

  const handleChange = (v: string): void => {
    setInviteCode(v);
    setUsedClipboard(false);
    setError('');
  };

  return (
    <View style={styles.container}>
      {!!error && <Text style={TextStyles.error}>{error}</Text>}
      <Input
        label="Invitation Code"
        onChangeText={handleChange}
        value={inviteCode}
        placeholder="Enter Code"
        disabled={processing}
      />
      <TouchableOpacity
        onPress={handleAcceptInvitation}
        style={ButtonStyles.baseButton}
        disabled={processing}
      >
        <Text style={TextStyles.button}>Accept Invitation</Text>
      </TouchableOpacity>
    </View>
  );
}

export default AcceptInvitation;
