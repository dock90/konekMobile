import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Avatar from './Avatar';

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
    fontSize: 30,
  },
});

function ContactItem({ contactData: { contactId, name, picture, profile } }) {
  const navigation = useNavigation();

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

  return (
    <View style={styles.container}>
      <View style={styles.contact}>
        <Avatar picture={picture} style={styles.contactImage} />
        <Text style={styles.contactTitle}>{name}</Text>
      </View>
      <View style={styles.actions}>
        {profile && (
          <TouchableOpacity onPress={handleStartConversation}>
            <MaterialIcons name="chat" style={styles.actionIcon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSelectContact}>
          <MaterialIcons name="person" style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ContactItem;
