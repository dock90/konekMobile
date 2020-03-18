import React from 'react'
import { Button, Image, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import { auth } from '../config/firebase'
// queries
import { ME_QUERY } from '../gql/MeQuery'

function ProfileScreen() {
  const { loading, error, data } = useQuery(ME_QUERY);

  const handleLogout = () => {
    auth
      .signOut()
    console.log('Logout Success')
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>'Loading...'</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>There was an error:</Text>
        <Text>{error.message}</Text>
      </View>
    )
  }

  const {
    me: {
      name,
      city,
      state,
    }
  } = data
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{name}</Text>
      <Text>{city}, {state}</Text>
      <Button
        onPress={handleLogout}
        title="Logout"
      />
    </View>
  );
}

export default ProfileScreen
