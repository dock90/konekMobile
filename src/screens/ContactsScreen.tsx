import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import {
  ALL_CONTACTS_QUERY,
  AllContactsQueryResults,
  AllContactsQueryVariables,
} from '../queries/ContactQueries';
import ContactItem from '../components/ContactItem';
import Loading from '../components/Loading';
import Error from '../components/Error';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginLeft: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

const ContactsScreen: React.FC = () => {
  const { data, error, loading } = useQuery<
    AllContactsQueryResults,
    AllContactsQueryVariables
  >(ALL_CONTACTS_QUERY, {
    pollInterval: 60000,
  });

  if (loading || !data) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <FlatList
        data={data.contacts.data}
        renderItem={({ item }) => (
          <ContactItem key={item.contactId} contactData={item} />
        )}
        keyExtractor={(item) => item.contactId}
      />
    </View>
  );
};

export default ContactsScreen;
