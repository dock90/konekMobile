import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Loading from '../../components/Loading';
import { PRIMARY } from '../../styles/Colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
  },
  textContainer: {
    borderRadius: 5,
    backgroundColor: 'lightgray',
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 11,
    color: PRIMARY,
    textAlign: 'center',
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 6,
    paddingLeft: 6,
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
      <View style={styles.textContainer}>
        <Text style={styles.text}>Beginning of Chat</Text>
      </View>
    )}
  </View>
);

export default BeginningOfConversation;
