import React from 'react'
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { useQuery } from '@apollo/client';
// queries
import { CONTACT_QUERY } from '../gql/ContactQueries'

function ContactScreen({ navigation, route }) {
  const { contactId } = route.params
  const { data, error, loading } = useQuery(CONTACT_QUERY, {
    variables: { contactId },
    pollInterval: 5000
  });

  const handleStartConversation = () => {
    const { roomId } = profile
    navigation.navigate('Message', {
      name,
      roomId
    })
  }

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
      picture,
      bio,
      tags, profile
    }
  } = data

  // "color": "00ff00",
  // "hidden": false,
  // "name": "Animal 🐻",
  // "tagId": "5e69065c584cee00044e56b6",

  let url = 'https://image.freepik.com/free-icon/important-person_318-10744.jpg'
  if (picture) {
    const { format, publicId } = picture
    const cloudName = "equiptercrm"
    url = `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.${format}` || ''
  }

  return (
    <View style={styles.container}>
      <View style={styles.contactContainer}>
        <View style={styles.contact}>
          <Image
            source={{ uri: url }}
            style={styles.contactImage}
          />
          <Text style={styles.contactTitle}>{name}</Text>
          <Text>{bio}</Text>
        </View>
        <View style={styles.contactActions}>
          {tags &&
            <View style={styles.tagsContainer}>
              {tags.map(tag => {
                const { color, id, name } = tag
                return (
                  <View
                    key={id}
                    style={{
                      backgroundColor: `#${color}`,
                      marginRight: 10,
                      padding: 5,
                    }}
                  >
                    <Text
                      key={`txt${id}`}
                      style={styles.tagText}
                    >
                      {name}
                    </Text>
                  </View>
                )
              }

              )}
            </View>
          }
          {profile &&
            <TouchableOpacity
              onPress={handleStartConversation}
            >
              <Text style={styles.conversationAction}>send message</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contactContainer: {
    width: 200,
    alignItems: 'center',
  },
  contact: {
    alignItems: 'center',
    marginBottom: 50,
  },
  contactImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 20
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  contactActions: {},
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  tagText: {
    color: '#FFFFFF'
  },
  conversationAction: {
    fontSize: 12,
    color: '#5D00D8',
    textTransform: 'capitalize'
  }
})

export default ContactScreen
