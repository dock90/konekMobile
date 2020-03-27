import React from 'react'
import { Button, Image, Text, View, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { auth } from '../config/firebase'
// queries
import { ME_QUERY } from '../gql/MeQueries'
// components
import Header from '../components/Header'
import AcceptInvitation from '../components/AcceptInvitation'

function ProfileScreen() {
  const { client, data, error, loading } = useQuery(ME_QUERY, {
    pollInterval: 1000
  });

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => client.resetStore())
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
      picture,
      cloudinaryInfo: {
        cloudName,
      },
      access: {
        hasContact
      }
    }
  } = data

  let url = 'https://image.freepik.com/free-icon/important-person_318-10744.jpg'
  if (picture) {
    const { format, publicId } = picture
    url = `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.${format}` || ''
  }

  return (
    <View style={styles.container}>
      <Header title="Me" />
      <Image
        style={{ width: 50, height: 50 }}
        source={{ uri: url }}
      />
      <Text>{name}</Text>
      <Text>{city}, {state}</Text>
      {!hasContact &&
        <AcceptInvitation />
      }
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
