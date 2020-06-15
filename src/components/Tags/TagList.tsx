import React from 'react';
import { View } from 'react-native';
import { TagFieldsInterface } from '../../queries/TagQueries';
import TagItem from './TagItem';

type Props = {
  tags: Array<TagFieldsInterface>;
};

const TagList: React.FC<Props> = ({ tags }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {tags.map((t) => (
        <TagItem key={t.tagId} tag={t} />
      ))}
    </View>
  );
};

export default TagList;
