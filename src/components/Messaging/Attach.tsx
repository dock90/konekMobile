import React, { useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { BugSnag } from '../../config/BugSnag';
import { useMe } from '../../hooks/useMe';
import { AssetInterface } from '../../queries/AssetQueries';
import { RoomFieldsInterface } from '../../queries/RoomQueries';
import { uploadFile } from '../../service/Cloudinary';
import { PRIMARY } from '../../styles/Colors';

interface Props {
  room: RoomFieldsInterface;
  onSend: (asset: AssetInterface) => Promise<void>;
  setProcessing?: (processing: boolean) => void;
}

const Attach: React.FC<Props> = ({ onSend, room, setProcessing }) => {
  const {
    me: { cloudinaryInfo },
  } = useMe();

  const onPress = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Send an Image',
        mediaType: 'photo',
        allowsEditing: true,
        noData: true,
        tintColor: PRIMARY,
        storageOptions: {
          skipBackup: true,
          path: 'KonekMe',
        },
      },
      async (response) => {
        if (response.didCancel) {
          return;
        }
        setProcessing && setProcessing(true);
        try {
          const asset = await uploadFile(
            {
              folder: room.roomId,
              tags: ['message'],
              apiKey: cloudinaryInfo.apiKey,
              cloudName: cloudinaryInfo.cloudName,
              resourceType: 'image',
            },
            {
              uri: response.uri,
              type: response.type as string,
              name: response.fileName as string,
            }
          );

          await onSend(asset);
        } catch (e) {
          BugSnag && BugSnag.notify(e);
          console.log(e);
        }

        setProcessing && setProcessing(false);
      }
    );
  }, [cloudinaryInfo, onSend, room.roomId, setProcessing]);
  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialIcons name="add" size={30} color={PRIMARY} />
    </TouchableOpacity>
  );
};

export default Attach;
