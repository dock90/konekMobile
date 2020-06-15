import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Route,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Avatar from '../components/Avatar';
import Error from '../components/Error';
import Link from '../components/Link';
import Loading from '../components/Loading';
import {
  CONTACT_QUERY,
  ContactsQueryResults,
  ContactsQueryVariables,
} from '../queries/ContactQueries';
import { PersonFieldsInterface } from '../queries/PeopleQueries';
import { PRIMARY } from '../styles/Colors';
import { ContainerStyles } from '../styles/ContainerStyles';
import { TextStyles } from '../styles/TextStyles';
import { ContactsStack } from './ContactsStackScreen';
import { MessagesStackParamList } from './MessagesStackScreen';

const spaceBetween = 10;

const styles = StyleSheet.create({
  contact: {
    alignItems: 'center',
    marginBottom: 50,
    ...ContainerStyles.textContainer,
  },
  picture: {
    marginBottom: spaceBetween,
  },
  name: {
    fontSize: 12,
    marginBottom: spaceBetween,
  },
  actions: {},
  spaced: {
    marginBottom: spaceBetween,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tagText: {
    color: '#FFFFFF',
  },
  actionText: {
    fontSize: 12,
    color: PRIMARY,
    textTransform: 'capitalize',
  },
});

type Props = {
  navigation: StackNavigationProp<ContactsStack & MessagesStackParamList>;
  route: Route;
};

const PersonScreen: React.FC<Props> = ({ navigation, route }) => {
  const { person } = route.params as { person: PersonFieldsInterface },
    hasContact = !!person.contactId;

  const { data, error, loading, refetch } = useQuery<
    ContactsQueryResults,
    ContactsQueryVariables
  >(CONTACT_QUERY, {
    variables: { contactId: person.contactId as string },
    skip: !hasContact,
  });
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      title: person.name,
    });
  }, [person]);

  if (hasContact) {
    if (error) {
      return <Error error={error} />;
    }

    if (loading || !data) {
      return <Loading />;
    }
  }

  async function handleRefresh(): Promise<void> {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  const handleStartConversation = () => {
    navigation.navigate('Message', {
      roomId: person.roomId,
    });
  };

  return hasContact && data && data.contact ? (
    <ScrollView
      contentContainerStyle={ContainerStyles.baseContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.contact}>
        <Avatar
          picture={data.contact.picture}
          size={80}
          style={styles.picture}
        />
        {data.contact.legalName && (
          <Text style={styles.name}>{data.contact.legalName}</Text>
        )}
        {data.contact.bio && (
          <Text style={styles.spaced}>{data.contact.bio}</Text>
        )}
        {data.contact.emails.length > 0 && (
          <View style={[ContainerStyles.leftAlign, styles.spaced]}>
            <Text style={TextStyles.h2}>Emails</Text>
            {data.contact.emails.map((e, k) => (
              <View key={k} style={{ flexDirection: 'row' }}>
                <Text>{e.label}: </Text>
                <Link url={`mailto:${e.email}`}>{e.email}</Link>
              </View>
            ))}
          </View>
        )}
        {data.contact.phones.length > 0 && (
          <View style={[ContainerStyles.leftAlign, styles.spaced]}>
            <Text style={TextStyles.h2}>Phone Numbers</Text>
            {data.contact.phones.map((p, k) => (
              <View key={k} style={{ flexDirection: 'row' }}>
                <Text key={k}>{p.label}: </Text>
                <Link url={`tel:${p.number}`}>{p.number}</Link>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleStartConversation}>
          <Text style={styles.actionText}>send message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  ) : (
    <ScrollView contentContainerStyle={ContainerStyles.baseContainer}>
      <View style={styles.contact}>
        <Avatar picture={person.picture} size={80} style={styles.picture} />
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleStartConversation}>
          <Text style={styles.actionText}>send message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PersonScreen;
