import React, { useContext } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import { MeContext } from '../contexts/MeContext';
import { AssetFieldsInterface } from '../queries/AssetQueries';
import { MeFieldsInterface } from '../queries/MeQueries';
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
};

const Avatar: React.FC<Props> = ({ picture, size, style }) => {
  const { cloudinaryInfo } = useContext(MeContext) as MeFieldsInterface;

  if (!size) {
    size = 45;
  }

  const sizing = {
    height: size,
    width: size,
    fontSize: size,
  };

  if (!picture) {
    return (
      <MaterialIcons
        name="account-circle"
        style={[styles.icon, sizing, style]}
      />
    );
  }

  // Delete this so validation doesn't complain.
  delete sizing.fontSize;

  const uri = `https://res.cloudinary.com/${cloudinaryInfo.cloudName}/${picture.resourceType}/${picture.type}/c_fit,h_100,q_auto,w_100/v1/${picture.publicId}.${picture.format}`;

  return <Image style={[styles.image, sizing, style]} source={{ uri }} />;
};

export default Avatar;
