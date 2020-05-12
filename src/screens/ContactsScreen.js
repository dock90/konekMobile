import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { ALL_CONTACTS_QUERY } from '../queries/ContactQueries';
import ContactItem from '../components/ContactItem';
import { PRIMARY } from '../styles/Colors';

function ContactsScreen({ navigation }) {
  const { data, error, loading } = useQuery(ALL_CONTACTS_QUERY, {
    pollInterval: 5000,
  });

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>There was an error:</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const { contacts } = data;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <FlatList
        data={contacts.data}
        renderItem={({ item }) => (
          <ContactItem
            key={item.contactId}
            contactData={item}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.contactId}
      />
    </View>
  );
}

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

export default ContactsScreen;
