import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity, Text, View, Route } from 'react-native';
import { useQuery } from '@apollo/client';
import Avatar from '../components/Avatar';
import {
  CONTACT_QUERY,
  ContactsQueryResults,
  ContactsQueryVariables,
} from '../queries/ContactQueries';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { ContactsStack } from './ContactsStackScreen';
import { MessagesStackParamList } from './MessagesStackScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactActions: {},
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tagText: {
    color: '#FFFFFF',
  },
  conversationAction: {
    fontSize: 12,
    color: '#5D00D8',
    textTransform: 'capitalize',
  },
});
type Props = {
  navigation: StackNavigationProp<ContactsStack & MessagesStackParamList>;
  route: Route;
};

const ContactScreen: React.FC<Props> = ({ navigation, route }) => {
  const { contactId } = route.params;
  const { data, error, loading } = useQuery<
    ContactsQueryResults,
    ContactsQueryVariables
  >(CONTACT_QUERY, {
    variables: { contactId },
  });

  if (error) {
    return <Error error={error} />;
  }

  if (loading || !data) {
    return <Loading />;
  }

  const {
    contact: { name, picture, bio, tags, profile },
  } = data;

  const handleStartConversation = () => {
    navigation.navigate('Message', {
      roomId: data.contact.profile.roomId,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contactContainer}>
        <View style={styles.contact}>
          <Avatar picture={picture} size={80} style={styles.contactImage} />
          <Text style={styles.contactTitle}>{name}</Text>
          <Text>{bio}</Text>
        </View>
        <View style={styles.contactActions}>
          {tags && (
            <View style={styles.tagsContainer}>
              {tags.map((tag) => {
                const { color, tagId, name } = tag;
                return (
                  <View
                    key={tagId}
                    style={{
                      backgroundColor: `#${color}`,
                      marginRight: 10,
                      padding: 5,
                    }}
                  >
                    <Text style={styles.tagText}>{name}</Text>
                  </View>
                );
              })}
            </View>
          )}
          {profile && (
            <TouchableOpacity onPress={handleStartConversation}>
              <Text style={styles.conversationAction}>send message</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default ContactScreen;
