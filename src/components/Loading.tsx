import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PRIMARY } from '../styles/Colors';

type Props = {
  size?: number | 'small' | 'large';
};

const Loading: React.FC<Props> = ({ size }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator size={size || 'large'} color={PRIMARY} />
  </View>
);

export default Loading;
