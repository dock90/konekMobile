import React from 'react'
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native'

function MessageItem({ messageData, navigation }) {
  const {
    roomId,
    name,
    picture
  } = messageData

  const handleSelect = () => {
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
    <TouchableOpacity
      style={styles.container}
      onPress={handleSelect}
    >
      <Image
        style={{ width: 50, height: 50 }}
        source={{ uri: url }}
      />
      <Text>{name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default MessageItem
