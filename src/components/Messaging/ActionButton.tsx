import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { BugSnag } from '../../config/BugSnag';
import { useInterval } from '../../hooks/useInterval';
import { useMe } from '../../hooks/useMe';
import { AssetInterface } from '../../queries/AssetQueries';
import { RoomFieldsInterface } from '../../queries/RoomQueries';
import { uploadFile } from '../../service/Cloudinary';
import { Recorder } from '../../service/Recorder';
import { PRIMARY } from '../../styles/Colors';

function formatLength(length: number): string {
  const minutes = Math.round(length / 60000),
    seconds = String(Math.round(length / 1000 - minutes * 60)).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
  },
  icon: {
    color: PRIMARY,
  },
});

enum MODE {
  READY = 'ready',
  SEND = 'send',
  RECORDING = 'rec',
  PROCESSING = 'proc',
}
let DEFAULT_MODE = MODE.READY;

Recorder.isPermissionDenied().then((denied) => {
  if (denied) {
    DEFAULT_MODE = MODE.SEND;
  }
});

type Props = {
  onSend: () => Promise<void>;
  hasText: boolean;
  onRecordingSend: (asset: AssetInterface) => void;
  room: RoomFieldsInterface;
};

const ActionButton: React.FC<Props> = ({
  onSend,
  hasText,
  onRecordingSend,
  room,
}) => {
  const {
    me: { cloudinaryInfo },
  } = useMe();

  const [actionMode, setActionMode] = useState(DEFAULT_MODE);
  const [recording, setRecording] = useState<null | Recorder>(null);
  const [recordingLength, setRecordingLength] = useState(0);

  useInterval(
    () => {
      if (recording) {
        setRecordingLength(recording.length());
      } else {
        setRecordingLength(0);
      }
    },
    500,
    actionMode === MODE.RECORDING
  );

  useEffect(() => {
    if (actionMode !== DEFAULT_MODE && actionMode !== DEFAULT_MODE) {
      return;
    }
    if (hasText) {
      setActionMode(MODE.SEND);
    } else {
      setActionMode(DEFAULT_MODE);
    }
  }, [hasText, actionMode]);

  async function handlePress(): Promise<void> {
    if (!hasText) {
      // Don't attempt to send if we don't have any data!
      return;
    }
    setActionMode(MODE.PROCESSING);
    await onSend();
    setActionMode(DEFAULT_MODE);
  }

  async function handlePressIn(): Promise<void> {
    if (actionMode !== DEFAULT_MODE) {
      return;
    }
    setActionMode(MODE.PROCESSING);
    setRecordingLength(0);
    const r = new Recorder();

    const isRecording = await r.start();
    if (isRecording) {
      Vibration.vibrate(100);
      setRecording(r);
      setActionMode(MODE.RECORDING);
    } else {
      setActionMode(DEFAULT_MODE);
    }
  }
  async function handlePressOut(): Promise<void> {
    if (!recording) {
      return;
    }

    await recording.stop();
    setActionMode(MODE.PROCESSING);

    const file = await recording.getFile();

    if (file) {
      try {
        const upload = await uploadFile(
          {
            folder: room.roomId,
            apiKey: cloudinaryInfo.apiKey,
            cloudName: cloudinaryInfo.cloudName,
            resourceType: 'video',
            tags: ['recording', room.roomId],
          },
          file
        );
        await onRecordingSend(upload);
      } catch (e) {
        BugSnag && BugSnag.notify(e);
        Alert.alert('Error', 'Error sending message.');
      }
    }
    setRecording(null);
    setActionMode(DEFAULT_MODE);
  }

  let actionIcon = 'send';
  switch (actionMode) {
    case MODE.RECORDING:
      actionIcon = 'music-note';
      break;
    case MODE.READY:
      actionIcon = 'mic';
      break;
  }

  return (
    <View>
      {actionMode === MODE.RECORDING && (
        <View style={{ position: 'relative' }}>
          <View
            style={{
              position: 'absolute',
              height: 40,
              width: 75,
              bottom: 5,
              right: 0,
              paddingBottom: 4,
              borderWidth: StyleSheet.hairlineWidth,
              borderRadius: 15,
              borderColor: PRIMARY,
              backgroundColor: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <MaterialIcons name="mic" style={{ color: 'red' }} size={22} />
            <Text
              style={{
                color: PRIMARY,
                textAlign: 'center',
                opacity: 1,
                fontSize: 15,
              }}
            >
              {formatLength(recordingLength)}
            </Text>
          </View>
        </View>
      )}
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
      >
        {actionMode === MODE.PROCESSING ? (
          <ActivityIndicator size={20} color={PRIMARY} />
        ) : (
          <MaterialIcons name={actionIcon} style={styles.icon} size={20} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ActionButton;
