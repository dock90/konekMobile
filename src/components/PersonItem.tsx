import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PersonFieldsInterface } from '../queries/PeopleQueries';
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
  person: PersonFieldsInterface;
};

const PersonItem: React.FC<Props> = ({ person }) => {
  const navigation = useNavigation();

  const handleSelectContact = () => {
    navigation.navigate('Person', {
      person: person,
    });
  };

  const handleStartConversation = () => {
    if (!person.roomId) {
      return;
    }
    navigation.navigate('Message', {
      name: person.name,
      roomId: person.roomId,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelectContact}>
        <View style={styles.contact}>
          <Avatar picture={person.picture} style={styles.contactImage} />
          <Text style={styles.contactTitle}>{person.name}</Text>
        </View>
      </TouchableOpacity>

      {person.roomId && (
        <TouchableOpacity onPress={handleStartConversation}>
          <MaterialIcons name="chat" style={styles.actionIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PersonItem;
