import { StyleSheet } from 'react-native';
import { BORDER, ERROR_TEXT, TEXT_ON_PRIMARY } from './Colors';

export const TextStyles = StyleSheet.create({
  error: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: ERROR_TEXT,
    marginRight: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  h1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    color: TEXT_ON_PRIMARY,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  link: {
    color: BORDER,
  },
});
