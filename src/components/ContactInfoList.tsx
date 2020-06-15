import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { EmailsFields, PhonesFields } from '../queries/ContactQueries';
import { ContainerStyles } from '../styles/ContainerStyles';
import { TextStyles } from '../styles/TextStyles';
import Link from './Link';

type Props = {
  label: string;
  keyId: 'number' | 'email';
  items: Array<PhonesFields | EmailsFields>;
  style?: ViewStyle;
};

const ContactInfoList: React.FC<Props> = ({ label, keyId, items, style }) => {
  let scheme = 'mailto:';
  if (keyId === 'number') {
    scheme = 'tel:';
  }
  return (
    <View style={[ContainerStyles.leftAlign, style]}>
      <Text style={TextStyles.h2}>{label}</Text>
      {items.map((i, k) => (
        <View key={k} style={{ flexDirection: 'row' }}>
          {!!i.label && <Text>{i.label}: </Text>}
          <Link url={`${scheme}${i[keyId]}`}>{i[keyId]}</Link>
        </View>
      ))}
    </View>
  );
};

export default ContactInfoList;
