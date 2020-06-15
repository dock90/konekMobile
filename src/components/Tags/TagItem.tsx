import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { TagFieldsInterface } from '../../queries/TagQueries';
import { BORDER } from '../../styles/Colors';

function textColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return '#ffffff';
  }
  const rgb = {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 255000;

  if (brightness >= 0.5) {
    return '#000000';
  }
  return '#ffffff';
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: BORDER,
    paddingLeft: 3,
    paddingRight: 3,
    marginRight: 3,
    marginLeft: 3,
  },
});

type Props = {
  tag: TagFieldsInterface;
};

const TagItem: React.FC<Props> = ({ tag }) => {
  const style: TextStyle = {
    backgroundColor: `#${tag.color}`,
    color: textColor(tag.color),
  };
  return <Text style={[styles.tag, style]}>{tag.name}</Text>;
};

export default TagItem;
