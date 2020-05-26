import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation } from '@apollo/client';
import { ACCEPT_INVITATION_MUTATION } from '../queries/InvitationQueries';
import { MaterialIcons } from '@expo/vector-icons';
import { PRIMARY } from '../styles/Colors';

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
  const [inviteCode, setInviteCode] = useState();
  const [viewHeight, setViewHeight] = useState(false);
  const [acceptInvitation] = useMutation(ACCEPT_INVITATION_MUTATION);

  const handleAcceptInvitation = async () => {
    await acceptInvitation({
      variables: {
        code: inviteCode,
      },
    });
    setInviteCode('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.codeHeader}>Input Invite Code Here</Text>
      <View
        style={[styles.inputContainer, { marginBottom: viewHeight ? 75 : 20 }]}
      >
        <TextInput
          onBlur={() => setViewHeight(false)}
          onFocus={() => setViewHeight(true)}
          style={styles.input}
          onChangeText={(text) => setInviteCode(text)}
          placeholder="Code"
          value={inviteCode}
        />
        <TouchableOpacity
          onPress={handleAcceptInvitation}
          style={styles.sendContainer}
        >
          <MaterialIcons name="send" style={styles.sendIcon} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AcceptInvitation;
