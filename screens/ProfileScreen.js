import React from 'react'
import { Button, Image, Text, View, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { auth } from '../config/firebase'
// queries
import { ME_QUERY } from '../gql/MeQuery'
// components
import Header from '../components/Header'

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
        <Text>Loading...</Text>
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
      picture: {
        format,
        publicId
      },
      cloudinaryInfo: {
        cloudName,
      }
    }
  } = data

  const url = `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.${format}` || ''

  return (
    <View style={styles.container}>
      <Header title="Me" />
      <Image
        style={{ width: 50, height: 50 }}
        source={{ uri: url }}
      />
      <Text>{name}</Text>
      <Text>{city}, {state}</Text>
      <Button
        onPress={handleLogout}
        title="Logout"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default ProfileScreen
