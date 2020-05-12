import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PRIMARY } from '../styles/Colors';

type Props = {};
const Loading: React.FC<Props> = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator size="large" color={PRIMARY} />
  </View>
);

export default Loading;
