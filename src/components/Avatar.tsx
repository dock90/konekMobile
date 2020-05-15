import React, { useContext } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import { MeContext } from '../contexts/MeContext';
import { AssetFieldsInterface } from '../queries/AssetQueries';
import { MeFieldsInterface } from '../queries/MeQueries';
import { avatarUri } from '../service/AssetUris';
import { BORDER } from '../styles/Colors';

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
    color: BORDER,
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
  const { cloudinaryInfo } = useContext(MeContext) as MeFieldsInterface;

  if (!size) {
    size = 45;
  }
  if (!overlayColor) {
    overlayColor = '#ffffff';
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
