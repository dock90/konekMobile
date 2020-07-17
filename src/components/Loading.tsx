import React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';
import { PRIMARY } from '../styles/Colors';

type Props = {
  size?: number | 'small' | 'large';
  color?: string;
  style?: ViewStyle;
};

const Loading: React.FC<Props> = ({ size, color, style }) => (
  <View
    style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, style]}
  >
    <ActivityIndicator size={size || 'large'} color={color || PRIMARY} />
  </View>
);

export default Loading;
