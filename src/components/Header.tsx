import React from 'react';
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { AssetFieldsInterface } from '../queries/AssetQueries';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // height: 40,
  },
  picture: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

type Props = {
  title: string;
  picture?: AssetFieldsInterface | null;
  style?: StyleProp<ViewStyle>;
};

const Header: React.FC<Props> = ({ title, picture, style }) => (
  <SafeAreaView style={[styles.container, style]}>
    {picture && <Avatar picture={picture} size={30} style={styles.picture} />}
    <Text style={styles.title}>{title}</Text>
  </SafeAreaView>
);

export default Header;
