import React, { useCallback } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { PRIMARY } from '../styles/Colors';

const styles = StyleSheet.create({
  link: {
    color: PRIMARY,
    textDecorationLine: 'underline',
  },
});

type Props = {
  url: string;
  children: React.ReactNode;
};

const Link: React.FC<Props> = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    const supported = Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert(`Don't know how to open URL: ${url}`);
      return;
    }

    await Linking.openURL(url);
  }, [url]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.link}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Link;
