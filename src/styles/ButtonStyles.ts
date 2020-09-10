import { StyleSheet } from 'react-native';
import { DISABLED, PRIMARY } from './Colors';

export const ButtonStyles = StyleSheet.create({
  baseButton: {
    width: 240,
    height: 40,
    backgroundColor: PRIMARY,
    borderRadius: 5,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  smallButton: {
    width: 200,
    height: 30,
    backgroundColor: PRIMARY,
    borderRadius: 3,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    backgroundColor: DISABLED,
  },
  secondaryButton: {
    borderRadius: 5,
    borderColor: PRIMARY,
    borderWidth: 1,
    padding: 3,
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
  },
});
