import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { MeContext } from '../contexts/MeContext';
import { AssetFieldsInterface } from '../queries/AssetQueries';
import { MeFieldsInterface } from '../queries/MeQueries';
import { originalPath } from '../service/AssetUris';
import ImageAsset from './Asset/ImageAsset';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    margin: 5,
  },
  playContainer: {
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 50,
    margin: 3,
  },
  playIcon: {
    color: '#fff',
  },
  image: {
    width: 150,
  },
});

type Props = {
  asset: AssetFieldsInterface;
  textColor?: string;
};

const STATE_INITIAL = 'init',
  STATE_LOADING = 'loading',
  STATE_PLAYING = 'playing';

const Asset: React.FC<Props> = ({ asset, textColor }) => {
  const textStyle: TextStyle = {
    color: textColor ? textColor : '',
  };

  const { cloudinaryInfo } = useContext(MeContext) as MeFieldsInterface;
  const [audio, setAudio] = useState<null | Audio.Sound>(null);
  const [playbackStatus, setPlaybackStatus] = useState(STATE_INITIAL);

  async function handlePlay() {
    if (!audio) {
      const sound = new Audio.Sound();
      setAudio(sound);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded || status.isBuffering) {
          if (audio) {
            // We're only actually loading if we have an audio object.
            // Otherwise, we may have just now stopped.
            setPlaybackStatus(STATE_LOADING);
          }
        } else if (status.isPlaying) {
          setPlaybackStatus(STATE_PLAYING);
        } else if (status.didJustFinish) {
          setPlaybackStatus(STATE_INITIAL);
          setAudio(null);
          sound.unloadAsync();
        } else {
          setPlaybackStatus(STATE_INITIAL);
        }
      });
      await sound.loadAsync({
        uri: originalPath(asset, cloudinaryInfo),
      });
      await sound.playAsync();
    } else {
      if (playbackStatus === STATE_PLAYING) {
        await audio.pauseAsync();
      } else {
        // Play from whatever our current position is.
        await audio.playAsync();
      }
    }
  }

  let thumb = null;

  switch (asset.resourceType) {
    case 'video':
      if (asset.isAudio) {
        const icon = playbackStatus === STATE_PLAYING ? 'pause' : 'play-arrow';
        thumb = (
          <TouchableOpacity style={styles.playContainer} onPress={handlePlay}>
            {playbackStatus === STATE_LOADING ? (
              <ActivityIndicator color="#fff" size={30} />
            ) : (
              <MaterialIcons name={icon} size={30} style={styles.playIcon} />
            )}
          </TouchableOpacity>
        );
        break;
      }
    case 'image':
      thumb = (
        <ImageAsset
          asset={asset}
          cloudinaryInfo={cloudinaryInfo}
          thumbnailWidth={150}
        />
      );
      break;
    case 'raw':
      thumb = <Text style={textStyle}>{asset.originalFilename}</Text>;
      break;
  }
  return <View style={styles.container}>{thumb}</View>;
};

export default Asset;
