import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import Error from '../components/Error';
import Loading from '../components/Loading';
import { updateApplicationIconBadgeNumber } from '../config/PushNotifications';
import { useMe } from '../hooks/useMe';
import { ROOMS_QUERY, RoomsQuery } from '../queries/RoomQueries';
import RoomItem from '../components/RoomItem';
import { MessagesStackParamList } from './MessagesStackScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  navigation: StackNavigationProp<MessagesStackParamList, 'Rooms'>;
};

const RoomsScreen: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { refresh: refreshMe } = useMe();
  const { loading, error, data, refetch } = useQuery<RoomsQuery>(ROOMS_QUERY);

  if (loading || !data) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  async function handleRefresh() {
    const activities: Array<Promise<unknown>> = [
      refetch(),
      refreshMe(),
      updateApplicationIconBadgeNumber(false),
    ];
    setRefreshing(true);
    await Promise.all(activities);
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <FlatList
        onRefresh={handleRefresh}
        refreshing={refreshing}
        data={data.rooms}
        renderItem={({ item }) => (
          <RoomItem key={item.roomId} room={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.roomId}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center' }}>No Messages</Text>
        }
      />
    </View>
  );
};

export default RoomsScreen;
