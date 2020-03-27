import React from 'react'
import { Button, Image, StyleSheet, Text, View } from 'react-native'

function ContactItem({
  contactData: {
    contactId,
    name,
    picture,
    profile
  },
  navigation
}) {

  const handleSelectContact = () => {
    navigation.navigate('Contact', {
      name,
      contactId
    })
  }

  const handleStartConversation = () => {
    const { roomId } = profile
    navigation.navigate('Message', {
      name,
      roomId
    })
  }

  let url = 'https://image.freepik.com/free-icon/important-person_318-10744.jpg'
  if (picture) {
    const { format, publicId } = picture
    const cloudName = "equiptercrm"
    url = `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.${format}` || ''
  }

  return (
    <View style={styles.container}>
      <View style={styles.contact}>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: url }}
        />
        <Text>{name}</Text>
      </View>
      <View style={styles.actions}>
        <Button
          disabled={!profile}
          onPress={handleStartConversation}
          title="Message"
        />
        <Button
          title="Details"
          onPress={handleSelectContact}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})


export default ContactItem
