import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { InputStyles } from '../styles/InputStyles';

const styles = StyleSheet.create({
  label: {
    marginLeft: 5,
    marginBottom: 2,
  },
});

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
      {!!label && <Text style={styles.label}>{label}</Text>}
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
