import React from 'react'
import { ActivityIndicator, Image, Text, View } from 'react-native'
import { useQuery } from '@apollo/client';
// queries
import { CONTACT_QUERY } from '../gql/ContactQueries'

function ContactScreen({ route }) {
  const { contactId } = route.params
  const { data, error, loading } = useQuery(CONTACT_QUERY, {
    variables: { contactId }
  });

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#323232" />
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
    contact: {
      name,
      city,
      state,
      picture
    }
  } = data

  let url = 'https://image.freepik.com/free-icon/important-person_318-10744.jpg'
  if (picture) {
    const { format, publicId } = picture
    const cloudName = "equiptercrm"
    url = `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.${format}` || ''
  }

  return (
    <View>
      <Image
        style={{ width: 50, height: 50 }}
        source={{ uri: url }}
      />
      <Text>{name}</Text>
      <Text>{city}, {state}</Text>
    </View>
  )
}

export default ContactScreen
