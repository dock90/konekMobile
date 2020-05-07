import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation } from '@apollo/client';
// queries
import { ACCEPT_INVITATION_MUTATION } from '../gql/InvitationQueries';

import send3x from '../../assets/send3x.png';

function AcceptInvitation() {
  const [inviteCode, setInviteCode] = useState();
  const [viewHeight, setViewHeight] = useState(false);
  const [acceptInvitation] = useMutation(ACCEPT_INVITATION_MUTATION);

  const handleAcceptInvitation = (inviteCode) => {
    acceptInvitation({
      variables: {
        code: inviteCode,
      },
    }).then(() => setInviteCode(''));
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
          onPress={() => handleAcceptInvitation(inviteCode)}
          style={styles.sendContainer}
        >
          <Image style={styles.sendIcon} source={send3x} />
          <Text style={styles.sendText}>link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    height: 10,
    width: 10,
    marginRight: 5,
  },
  sendText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#5D00D8',
  },
});

export default AcceptInvitation;
