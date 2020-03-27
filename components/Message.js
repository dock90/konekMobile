import React from 'react'
import PropTypes from 'prop-types'
import { Image, View, Text, StyleSheet } from 'react-native'

function Message({ messageData }) {
  const {
    author: {
      name,
      picture,
    },
    body
  } = messageData

  let url = 'https://image.freepik.com/free-icon/important-person_318-10744.jpg'
  if (picture) {
    const { format, publicId } = picture
    const cloudName = "equiptercrm"
    url = `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.${format}` || ''
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImg}
        source={{ uri: url }}
      />
      <View>
        <Text>{name}</Text>
        <Text>{body}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  profileImg: {
    width: 30,
    height: 30,
  }
})

Message.propTypes = {
  messageData: PropTypes.shape({
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      picture: PropTypes.shape({
        format: PropTypes.string.isRequired,
        publicId: PropTypes.string.isRequired,
      })
    }),
    body: PropTypes.string.isRequired
  })
}

export default Message
