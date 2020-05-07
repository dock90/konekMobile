import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import chat3x from '../../assets/chat3x.png';
import profile3x from '../../assets/profile3x.png';

function ContactItem({
  contactData: { contactId, name, picture, profile },
  navigation,
}) {
  const handleSelectContact = () => {
    navigation.navigate('Contact', {
      name,
      contactId,
    });
  };

  const handleStartConversation = () => {
    const { roomId } = profile;
    navigation.navigate('Message', {
      name,
      roomId,
    });
  };

  let url =
    'https://image.freepik.com/free-icon/important-person_318-10744.jpg';
  if (picture) {
    const { format, publicId } = picture;
    const cloudName = 'equiptercrm';
    url =
      `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.${format}` ||
      '';
  }

  return (
    <View style={styles.container}>
      <View style={styles.contact}>
        <Image style={styles.contactImage} source={{ uri: url }} />
        <Text style={styles.contactTitle}>{name}</Text>
      </View>
      <View style={styles.actions}>
        {profile && (
          <TouchableOpacity onPress={handleStartConversation}>
            <Image style={styles.actionIcon} source={chat3x} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSelectContact}>
          <Image style={styles.actionIcon} source={profile3x} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginRight: 20,
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactImage: {
    height: 45,
    width: 45,
    borderRadius: 50,
    marginRight: 20,
  },
  contactTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    height: 30,
    width: 30,
    marginLeft: 10,
  },
});

export default ContactItem;
