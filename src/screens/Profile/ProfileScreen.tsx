import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { auth } from '../../config/firebase';
import { useMe } from '../../hooks/useMe';
import AcceptInvitation from '../../components/AcceptInvitation';
import Avatar from '../../components/Avatar';
import { ButtonStyles } from '../../styles/ButtonStyles';
import { BACKGROUND } from '../../styles/Colors';
import { ContainerStyles } from '../../styles/ContainerStyles';
import { TextStyles } from '../../styles/TextStyles';
import { ProfileStackParamList } from './ProfileStackScreen';

const styles = StyleSheet.create({
  container: {
    ...ContainerStyles.baseContainer,
    backgroundColor: BACKGROUND,
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  profile: {
    alignItems: 'center',
    marginBottom: 50,
  },
  picture: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileDetails: {
    fontSize: 12,
  },
  profileActions: {
    alignItems: 'center',
  },
});
interface Props {
  navigation: StackNavigationProp<ProfileStackParamList>;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { me } = useMe();

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('Logout Success');
    });
  };

  const handleEditTouch = () => {
    navigation.navigate('ProfileEdit');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={ContainerStyles.baseContainer}>
        <View style={styles.profile}>
          <Avatar picture={me.picture} size={80} style={styles.picture} />
          <Text style={styles.profileTitle}>{me.name}</Text>
          <Text style={styles.profileDetails}>
            {me.city}, {me.state} {me.postalCode}
            {!!me.country && ', ' + me.country}
          </Text>
          {!!me.language && (
            <Text style={styles.profileDetails}>{me.language}</Text>
          )}
        </View>
        <View style={styles.profileActions}>
          <TouchableOpacity
            style={ButtonStyles.baseButton}
            onPress={handleEditTouch}
          >
            <Text style={TextStyles.button}>Edit Profile</Text>
          </TouchableOpacity>
          {!me.access.hasContact && <AcceptInvitation />}
          <TouchableOpacity
            onPress={handleLogout}
            style={ButtonStyles.smallButton}
          >
            <Text style={TextStyles.buttonSmall}>logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
