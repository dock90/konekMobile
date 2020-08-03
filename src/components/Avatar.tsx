import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { useMe } from '../hooks/useMe';
import { AssetInterface } from '../queries/AssetQueries';
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
  picture?: AssetInterface | null;
  size?: number;
  style?: StyleProp<ImageStyle | TextStyle>;
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
  if (style && 'color' in style) {
    // remove this so RN doesn't throw a warning.
    delete style.color;
  }

  return (
    <Image
      style={[styles.image, sizing, style as ImageStyle]}
      source={{ uri: avatarUri(picture, cloudinaryInfo) }}
    />
  );
};

export default Avatar;
