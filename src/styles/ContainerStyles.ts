import { Platform, StyleSheet } from 'react-native';

export const ContainerStyles = StyleSheet.create({
  safeAreaViewContainer: {
    // On Android setting to "1" causes content to be hidden under the header.
    flex: Platform.OS === 'ios' ? 1 : undefined,
  },
  baseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginRight: 25,
    marginLeft: 25,
  },
  leftAlign: {
    width: '100%',
    alignSelf: 'flex-start',
  },
});
