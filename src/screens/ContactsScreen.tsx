import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import PersonItem from '../components/PersonItem';
import Loading from '../components/Loading';
import Error from '../components/Error';
import {
  PEOPLE_QUERY,
  PeopleQueryResults,
  personKeyExtractor,
} from '../queries/PeopleQueries';

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
  const [refreshing, setRefreshing] = useState(false);
  const { data, error, loading, refetch } = useQuery<PeopleQueryResults>(
    PEOPLE_QUERY
  );

  if (loading || !data) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  async function handleRefresh(): Promise<void> {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <FlatList
        onRefresh={handleRefresh}
        refreshing={refreshing}
        data={data.people}
        renderItem={({ item }) => (
          <PersonItem key={personKeyExtractor(item)} person={item} />
        )}
        keyExtractor={personKeyExtractor}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center' }}>No Contacts</Text>
        }
      />
    </View>
  );
};

export default ContactsScreen;
