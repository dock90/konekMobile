import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Loading from '../../components/Loading';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
  },
  text: {
    fontSize: 11,
    borderRadius: 5,
    textAlign: 'center',
    backgroundColor: 'gray',
    padding: 5,
  },
});

type Props = {
  loading?: boolean;
};

const BeginningOfConversation: React.FC<Props> = ({ loading }) => (
  <View style={styles.container}>
    {loading ? (
      <Loading size="small" />
    ) : (
      <Text style={styles.text}>Beginning of Chat</Text>
    )}
  </View>
);

export default BeginningOfConversation;
