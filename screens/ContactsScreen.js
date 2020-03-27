import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
// queries
import { ALL_CONTACTS_QUERY } from '../gql/ContactQueries'
// components
import ContactItem from '../components/ContactItem'

function ContactsScreen({ navigation }) {
  const { data, error, loading } = useQuery(ALL_CONTACTS_QUERY)

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#323232" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>There was an error:</Text>
        <Text>{error.message}</Text>
      </View>
    )
  }

  const { contacts } = data

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts.data}
        renderItem={({ item }) =>
          <ContactItem
            key={item.contactId}
            contactData={item}
            navigation={navigation}
          />
        }
        keyExtractor={item => item.contactId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default ContactsScreen
