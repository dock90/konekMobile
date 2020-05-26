import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import { useMe } from '../hooks/useMe';
import { AssetFieldsInterface } from '../queries/AssetQueries';
import { avatarUri } from '../service/AssetUris';
import { BACKGROUND, SECONDARY } from '../styles/Colors';

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
    color: SECONDARY,
  },
  image: {
    borderRadius: 50,
  },
});

type Props = {
  picture?: AssetFieldsInterface | null;
  size?: number;
  style?: StyleProp<ImageStyle>;
  overlayColor?: string | 'none';
};

const Avatar: React.FC<Props> = ({ picture, size, style, overlayColor }) => {
  const {
    me: { cloudinaryInfo },
  } = useMe();

  if (!size) {
    size = 45;
  }
  if (!overlayColor) {
    overlayColor = BACKGROUND;
  } else if (overlayColor === 'none') {
    overlayColor = '';
  }

  const sizing = {
    height: size,
    width: size,
    fontSize: size,
    overlayColor,
  };

  if (!picture) {
    delete sizing.overlayColor;

    return (
      <MaterialIcons
        name="account-circle"
        style={[styles.icon, sizing, style]}
      />
    );
  }

  // Delete this so validation doesn't complain.
  delete sizing.fontSize;

  return (
    <Image
      style={[styles.image, sizing, style]}
      source={{ uri: avatarUri(picture, cloudinaryInfo) }}
    />
  );
};

export default Avatar;
