import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';

type Props = {
  label: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

const LabeledItem: React.FC<Props> = ({
  label,
  children,
  style,
  labelStyle,
}) => {
  if (!children) {
    return null;
  }

  return (
    <View style={[{ flexDirection: 'row' }, style]}>
      <Text style={labelStyle}>{label}: </Text>
      <Text>{children}</Text>
    </View>
  );
};

export default LabeledItem;
