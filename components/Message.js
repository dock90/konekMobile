import React from 'react'
import { View, Text } from 'react-native'

function Message({ messageData }) {
  const {
    author,
    body
  } = messageData
  return (
    <View>
      <Text>{body}</Text>
    </View>
  )
}

export default Message
