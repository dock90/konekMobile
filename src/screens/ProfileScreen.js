import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { auth } from '../config/firebase';
import { ME_QUERY } from '../queries/MeQueries';
import Header from '../components/Header';
import AcceptInvitation from '../components/AcceptInvitation';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  profile: {
    alignItems: 'center',
    marginBottom: 50,
  },
  profileImage: {
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
    color: '#5D00D8',
  },
});

function ProfileScreen() {
  const { client, data, error, loading } = useQuery(ME_QUERY, {
    pollInterval: 1000,
  });

  const handleLogout = () => {
    auth.signOut().then(() => client.resetStore());
    console.log('Logout Success');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>There was an error:</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const {
    me: {
      name,
      city,
      state,
      picture,
      cloudinaryInfo: { cloudName },
      access: { hasContact },
    },
  } = data;

  let url =
    'https://image.freepik.com/free-icon/important-person_318-10744.jpg';
  if (picture) {
    const { format, publicId } = picture;
    url =
      `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.${format}` ||
      '';
  }

  return (
    <View style={styles.container}>
      <Header image={url} title="Me" />
      <View style={styles.profileContainer}>
        <View style={styles.profile}>
          <Image style={styles.profileImage} source={{ uri: url }} />
          <Text style={styles.profileTitle}>{name}</Text>
          <Text style={styles.profileDetails}>
            {city}, {state}
          </Text>
        </View>
        <View style={styles.profileActions}>
          {!hasContact && <AcceptInvitation />}
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.actionText}>logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ProfileScreen;
