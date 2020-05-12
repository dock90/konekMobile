import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  error: { message: string };
};
const Error: React.FC<Props> = ({ error }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>There was an error:</Text>
    <Text>{error.message}</Text>
  </View>
);

export default Error;
