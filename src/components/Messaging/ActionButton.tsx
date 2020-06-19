import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
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

const Animations = {
  show() {
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        property: 'opacity',
        type: 'easeIn',
      },
    });
  },
  hide() {
    LayoutAnimation.configureNext({
      duration: 250,
      delete: {
        property: 'opacity',
        type: 'easeOut',
      },
    });
  },
};

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

  const recorderRef = useRef<null | Recorder>(null),
    doCancel = useRef(false);

  const [actionMode, setActionMode] = useState(DEFAULT_MODE),
    [recordingLength, setRecordingLength] = useState(0);

  useInterval(
    () => {
      if (recorderRef.current) {
        setRecordingLength(recorderRef.current.length());
      } else {
        setRecordingLength(0);
      }
    },
    500,
    actionMode === MODE.RECORDING
  );

  const cancelRecording = useCallback(async (): Promise<void> => {
      doCancel.current = true;
      if (!recorderRef.current) {
        return;
      }
      Animations.hide();
      setActionMode(DEFAULT_MODE);
      await recorderRef.current.stop();
      recorderRef.current = null;
    }, []),
    startRecording = useCallback(async (): Promise<void> => {
      if (actionMode !== DEFAULT_MODE) {
        return;
      }
      setActionMode(MODE.PROCESSING);
      doCancel.current = false;
      setRecordingLength(0);

      const r = new Recorder();

      const isRecording = await r.start();
      recorderRef.current = r;

      if (doCancel.current) {
        await cancelRecording();
        return;
      }
      if (isRecording) {
        Vibration.vibrate(100);
        Animations.show();
        setActionMode(MODE.RECORDING);
      } else {
        setActionMode(DEFAULT_MODE);
      }
    }, [actionMode]),
    stopRecording = useCallback(async (): Promise<void> => {
      if (!recorderRef.current) {
        // we didn't hold long enough.
        doCancel.current = true;
        console.log('CANCEL!!!!!');
        return;
      }

      if (recorderRef.current.length() < 1000) {
        // If the recording is less than a second long, cancel it.
        await cancelRecording();
        return;
      }

      await recorderRef.current.stop();
      Animations.hide();
      setActionMode(MODE.PROCESSING);

      const file = await recorderRef.current.getFile();

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
          // BugSnag && BugSnag.notify(e);
          Alert.alert('Error', 'Error sending message');
        }
      }
      recorderRef.current = null;
      setActionMode(DEFAULT_MODE);
    }, [onRecordingSend, cancelRecording, cloudinaryInfo, room]),
    handlePress = useCallback(async (): Promise<void> => {
      if (!hasText) {
        // Don't attempt to send if we don't have any data!
        return;
      }
      setActionMode(MODE.PROCESSING);
      await onSend();
      setActionMode(DEFAULT_MODE);
    }, [hasText, onSend]);

  useEffect(() => {
    if (actionMode !== DEFAULT_MODE && actionMode !== MODE.SEND) {
      return;
    }
    if (hasText) {
      setActionMode(MODE.SEND);
    } else {
      setActionMode(DEFAULT_MODE);
    }
  }, [hasText, actionMode]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant() {
        startRecording();
      },
      onPanResponderRelease(_e, state) {
        if (Math.abs(state.dx) + Math.abs(state.dy) > 40) {
          cancelRecording();
        } else {
          stopRecording();
        }
      },
    })
  ).current;

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
              height: 50,
              width: 75,
              bottom: 5,
              right: 0,
              paddingBottom: 4,
              borderWidth: StyleSheet.hairlineWidth,
              borderRadius: 15,
              borderColor: PRIMARY,
              backgroundColor: '#fff',
              opacity: 0.95,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
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
            <Text
              style={{
                fontSize: 8,
                textAlign: 'center',
              }}
            >
              Swipe to cancel
            </Text>
          </View>
        </View>
      )}
      {hasText ? (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
          {actionMode === MODE.PROCESSING ? (
            <ActivityIndicator size={20} color={PRIMARY} />
          ) : (
            <MaterialIcons name="send" style={styles.icon} size={20} />
          )}
        </TouchableOpacity>
      ) : (
        <View {...panResponder.panHandlers} style={styles.container}>
          {actionMode === MODE.PROCESSING ? (
            <ActivityIndicator size={20} color={PRIMARY} />
          ) : (
            <MaterialIcons name={actionIcon} style={styles.icon} size={20} />
          )}
        </View>
      )}
    </View>
  );
};

export default ActionButton;
