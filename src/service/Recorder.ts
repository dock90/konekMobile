import { Audio } from 'expo-av';
import {
  askAsync,
  AUDIO_RECORDING,
  getAsync,
  PermissionStatus,
} from 'expo-permissions';
import { BugSnag } from '../config/BugSnag';

interface FileInterface {
  uri: string;
  name: string;
  type: string;
}

export class Recorder {
  private recording?: Audio.Recording;
  private startTime?: number;
  private stopTime?: number;
  private isStarted?: Promise<void>;

  private onRecordingStatusUpdate(status: Audio.RecordingStatus): void {
    console.log(status);
  }

  /**
   * Gets user permission (if required) and begins recording.
   * If permission wasn't granted, will return false.
   */
  public async start(): Promise<boolean> {
    let startupFinished: () => void = () => {
      console.log('This should never be called! 👻');
    };
    this.isStarted = new Promise<void>((resolve) => {
      startupFinished = resolve;
    });

    // const start = Date.now();
    // let prev = start;
    const res = await askAsync(AUDIO_RECORDING);
    if (res.status !== PermissionStatus.GRANTED) {
      return false;
    }
    // console.log('gotPerm', Date.now() - start, Date.now() - prev);
    // prev = Date.now();

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    // console.log('setAudioMode', Date.now() - start, Date.now() - prev);
    // prev = Date.now();

    this.recording = new Audio.Recording();
    // console.log('instantiation', Date.now() - start, Date.now() - prev);
    // prev = Date.now();

    try {
      await this.recording.prepareToRecordAsync({
        android: {
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          extension: '.mp4',
          numberOfChannels: 1,
          sampleRate: 44100,
          bitRate: 64000,
        },
        ios: {
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,
          bitRate: 64000,
          bitRateStrategy:
            Audio.RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_CONSTANT,
          sampleRate: 44100,
          extension: '.mp4',
          numberOfChannels: 1,
        },
      });
    } catch (e) {
      console.log(e);
      BugSnag && BugSnag.notify(e);
      return false;
    }

    // console.log('prepareToRecordAsync', Date.now() - start, Date.now() - prev);
    // prev = Date.now();

    this.recording.setProgressUpdateInterval(1000);
    this.recording.setOnRecordingStatusUpdate(this.onRecordingStatusUpdate);

    // console.log(
    //   'setOnRecordingStatusUpdate',
    //   Date.now() - start,
    //   Date.now() - prev
    // );
    // prev = Date.now();

    try {
      await this.recording.startAsync();
    } catch (e) {
      console.log(e);
      BugSnag && BugSnag.notify(e);
      return false;
    }

    // console.log('startAsync', Date.now() - start, Date.now() - prev);
    this.startTime = Date.now();

    console.log('STARTED');
    setTimeout(() => {
      // We need to wait a bit until allowing the "stop" method to be called because
      // Android throws an error if recording is stopped too quickly after starting.
      startupFinished();
    }, 500);
    return true;
  }

  public async stop(): Promise<void> {
    if (this.isStarted) {
      await this.isStarted;
    }
    if (!this.recording) {
      return;
    }

    console.log('STOP!');

    this.stopTime = Date.now();
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (e) {
      // swallow any errors.
      console.log(e);
      BugSnag && BugSnag.notify(e);
    }

    await Audio.setAudioModeAsync({
      // Set this to false so audio isn't routed through the earpiece.
      allowsRecordingIOS: false,
    });
    this.isStarted = undefined;
  }

  public async getFile(): Promise<FileInterface | undefined> {
    if (!this.recording) {
      console.log('NO RECORDING!');
      return;
    }

    const uri = this.recording.getURI();
    if (!uri) {
      return;
    }

    return {
      uri,
      name: 'recording.mp4',
      type: 'audio/mp4',
    };
  }

  /**
   * How long elapsed between starting and stopping the recording.
   */
  public length(): number {
    if (!this.startTime) {
      return 0;
    }
    if (!this.stopTime) {
      return Date.now() - this.startTime;
    }

    return this.stopTime - this.startTime;
  }

  /**
   * Checks if the user has denied access to the recording permission.
   */
  public static async isPermissionDenied(): Promise<boolean> {
    const perm = await getAsync(AUDIO_RECORDING);

    return perm.status === PermissionStatus.DENIED;
  }
}
