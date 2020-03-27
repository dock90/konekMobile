import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { useMutation } from '@apollo/client';
// queries
import { ACCEPT_INVITATION_MUTATION } from '../gql/InvitationQueries'

function AcceptInvitation() {
  const [inviteCode, setInviteCode] = useState()
  const [acceptInvitation] = useMutation(ACCEPT_INVITATION_MUTATION);

  const handleAcceptInvitation = (inviteCode) => {
    acceptInvitation({
      variables: {
        code: inviteCode
      }
    }).then(() => setInviteCode(''));
  }

  return (
    <View>
      <Text>Input Invite Code Here</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => setInviteCode(text)}
          value={inviteCode}
        />
        <Button
          onPress={() => handleAcceptInvitation(inviteCode)}
          title="Send"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'gray',
  },
  input: {
    flex: 1,
    height: 40,
  }
})

export default AcceptInvitation
