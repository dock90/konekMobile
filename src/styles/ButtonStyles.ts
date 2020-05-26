import { StyleSheet } from 'react-native';
import { PRIMARY } from './Colors';

export const ButtonStyles = StyleSheet.create({
  baseButton: {
    width: 240,
    height: 40,
    backgroundColor: PRIMARY,
    borderRadius: 3,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
});
