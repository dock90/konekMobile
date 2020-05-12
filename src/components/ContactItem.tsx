import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ContactSummaryFieldsInterface } from '../queries/ContactQueries';
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
    marginRight: 20,
  },
  contactTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionIcon: {
    height: 30,
    width: 30,
    marginLeft: 10,
    fontSize: 25,
  },
});

type Props = {
  contactData: ContactSummaryFieldsInterface;
};

const ContactItem: React.FC<Props> = ({ contactData }) => {
  const navigation = useNavigation();

  const handleSelectContact = () => {
    navigation.navigate('Contact', {
      name: contactData.name,
      contactId: contactData.contactId,
    });
  };

  const handleStartConversation = () => {
    if (!contactData.profile) {
      return;
    }
    navigation.navigate('Message', {
      name: contactData.name,
      roomId: contactData.profile.roomId,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelectContact}>
        <View style={styles.contact}>
          <Avatar picture={contactData.picture} style={styles.contactImage} />
          <Text style={styles.contactTitle}>{contactData.name}</Text>
        </View>
      </TouchableOpacity>

      {contactData.profile && (
        <TouchableOpacity onPress={handleStartConversation}>
          <MaterialIcons name="chat" style={styles.actionIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ContactItem;
