import { StyleSheet } from 'react-native';
import { TEXT_INPUT, BORDER, ERROR_TEXT } from './Colors';

export const InputStyles = StyleSheet.create({
  base: {
    width: 240,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
    fontSize: 12,
    color: TEXT_INPUT,
  },
  error: {
    borderColor: ERROR_TEXT,
    color: ERROR_TEXT,
  },
});
