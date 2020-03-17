import React from 'react'
import { Button, Text, View } from 'react-native';
import { auth } from '../config/firebase'

function ProfileScreen() {
  const handleLogout = () => {
    auth
      .signOut()
    console.log('Logout Success')
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button
        onPress={handleLogout}
        title="Logout"

      />
    </View>
  );
}

export default ProfileScreen
