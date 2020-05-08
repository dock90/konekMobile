import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { ROOMS_QUERY, RoomsQuery } from '../queries/RoomQueries';
import RoomItem from '../components/RoomItem';
import { PRIMARY } from '../styles/Colors';
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
  const { loading, error, data } = useQuery<RoomsQuery>(ROOMS_QUERY, {
    pollInterval: 1000,
  });

  if (loading || !data) {
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

  return (
    <View style={styles.container}>
      <FlatList
        data={data.rooms}
        renderItem={({ item }) => (
          <RoomItem
            key={item.roomId}
            messageData={item}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.roomId}
      />
    </View>
  );
};

export default RoomsScreen;
