import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { InputStyles } from '../styles/InputStyles';

type Props = {
  onChangeText: (text: string) => void;
  value: string | null;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

const Input: React.FC<Props> = ({
  onChangeText,
  value,
  label,
  placeholder,
  disabled,
}) => {
  return (
    <View>
      {!!label && <Text>{label}</Text>}
      <TextInput
        style={[InputStyles.base, disabled ? InputStyles.disabled : {}]}
        placeholder={placeholder}
        value={value || undefined}
        onChangeText={onChangeText}
        editable={!disabled}
      />
    </View>
  );
};

export default Input;
