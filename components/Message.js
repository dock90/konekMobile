import React from 'react'
import PropTypes from 'prop-types'
import { Image, View, Text, StyleSheet } from 'react-native'
import formatDateTime from '../utils/formatDate'

function Message({ messageData, me }) {
  const {
    author: {
      name,
      picture,
    },
    body,
    createdAt
  } = messageData

  const {
    data
  } = me

  const notMe = data.me.name !== name

  let url = 'https://image.freepik.com/free-icon/important-person_318-10744.jpg'
  if (picture) {
    const { format, publicId } = picture
    const cloudName = "equiptercrm"
    url = `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.${format}` || ''
  }

  return (
    <View
      style={[
        styles.container,
        { justifyContent: notMe ? 'flex-start' : 'flex-end' }
      ]}
    >
      {notMe &&
        <Image
          style={styles.profileImg}
          source={{ uri: url }}
        />
      }
      <View>
        {notMe &&
          <Text style={styles.contactName}>{name}</Text>
        }
        <View style={{
          backgroundColor: notMe ? '#69B98F' : '#5D00D8',
          borderRadius: 5
        }}>
          <Text style={styles.message}>{body}</Text>
        </View>
        <Text
          style={[
            styles.timestamp,
            { textAlign: notMe ? 'right' : 'left' }
          ]}
        >
          {formatDateTime(createdAt)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 35,
  },
  profileImg: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginRight: 10
  },
  contactName: {
    fontSize: 8,
    marginBottom: 5
  },
  message: {
    fontSize: 12,
    padding: 12,
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 8,
    color: '#ADADAD',
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
