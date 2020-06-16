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
  SafeAreaView,
} from 'react-native';
import Avatar from '../components/Avatar';
import ContactInfoList from '../components/ContactInfoList';
import Error from '../components/Error';
import LabeledItem from '../components/LabeledItem';
import Loading from '../components/Loading';
import TagList from '../components/Tags/TagList';
import {
  CONTACT_QUERY,
  ContactsQueryResults,
  ContactsQueryVariables,
} from '../queries/ContactQueries';
import { PersonFieldsInterface } from '../queries/PeopleQueries';
import { PRIMARY } from '../styles/Colors';
import { ContainerStyles } from '../styles/ContainerStyles';
import { ContactsStack } from './ContactsStackScreen';
import { MessagesStackParamList } from './MessagesStackScreen';

const spaceBetween = 20;

const styles = StyleSheet.create({
  contact: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: spaceBetween * 2,
    ...ContainerStyles.textContainer,
  },
  actions: {
    marginBottom: 20,
  },
  picture: {
    marginBottom: spaceBetween,
  },
  name: {
    fontSize: 12,
    marginBottom: spaceBetween,
  },
  spaced: {
    marginBottom: spaceBetween,
  },
  actionText: {
    fontSize: 12,
    color: PRIMARY,
    textTransform: 'capitalize',
  },
});

type Props = {
  navigation: StackNavigationProp<
    ContactsStack & MessagesStackParamList,
    'Person'
  >;
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
    <SafeAreaView>
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
          {data.contact.tags && data.contact.tags.length > 0 && (
            <TagList tags={data.contact.tags} />
          )}
          {data.contact.emails.length > 0 && (
            <ContactInfoList
              style={styles.spaced}
              label="Emails"
              keyId="email"
              items={data.contact.emails}
            />
          )}
          {data.contact.phones.length > 0 && (
            <ContactInfoList
              style={styles.spaced}
              keyId="number"
              items={data.contact.phones}
              label="Phone Numbers"
            />
          )}
          <View style={[ContainerStyles.leftAlign, styles.spaced]}>
            <LabeledItem label="City">{data.contact.city}</LabeledItem>
            <LabeledItem label="State">{data.contact.state}</LabeledItem>
            <LabeledItem label="Postal Code">
              {data.contact.postalCode}
            </LabeledItem>
            <LabeledItem label="Country">{data.contact.country}</LabeledItem>
            <LabeledItem label="Language">{data.contact.language}</LabeledItem>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleStartConversation}>
              <Text style={styles.actionText}>send message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
