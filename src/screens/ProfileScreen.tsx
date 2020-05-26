import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { auth } from '../config/firebase';
import { useMe } from '../hooks/useMe';
import AcceptInvitation from '../components/AcceptInvitation';
import Avatar from '../components/Avatar';
import { BACKGROUND, PRIMARY } from '../styles/Colors';
import { ContainerStyles } from '../styles/ContainerStyles';

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
  actionText: {
    fontSize: 12,
    color: PRIMARY,
  },
});

function ProfileScreen() {
  const { me } = useMe();

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('Logout Success');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={ContainerStyles.baseContainer}>
        <View style={styles.profile}>
          <Avatar picture={me.picture} size={80} style={styles.picture} />
          <Text style={styles.profileTitle}>{me.name}</Text>
          <Text style={styles.profileDetails}>
            {me.city}, {me.state}
          </Text>
        </View>
        <View style={styles.profileActions}>
          {!me.access.hasContact && <AcceptInvitation />}
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.actionText}>logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ProfileScreen;
