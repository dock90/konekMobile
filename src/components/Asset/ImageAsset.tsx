import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { AssetFieldsInterface } from '../../queries/AssetQueries';
import { CloudinaryInfo } from '../../queries/MeQueries';
import { fullSizeUri, thumbnailUri } from '../../service/AssetUris';

type Props = {
  asset: AssetFieldsInterface;
  cloudinaryInfo: CloudinaryInfo;
  thumbnailWidth: number;
};

const ImageAsset: React.FC<Props> = ({
  asset,
  cloudinaryInfo,
  thumbnailWidth,
}) => {
  const [uri] = useState(thumbnailUri(asset, cloudinaryInfo));
  const [thumbSize, setThumbSize] = useState({
    height: 0,
    width: thumbnailWidth,
  });
  const [showModal, toggleModal] = useState(false);

  useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => {
        const scale = thumbnailWidth / (width > 0 ? width : 1);
        setThumbSize({ width: width, height: Math.round(height * scale) });
      },
      (error) => {
        // now what?
        console.log(error);
        console.log(uri);
      }
    );
  }, [asset, uri]);

  function handleImageTouch() {
    toggleModal(true);
  }
  function handleRequestClose() {
    toggleModal(false);
  }

  const windowDimen = Dimensions.get('window');

  return (
    <>
      <TouchableOpacity onPress={handleImageTouch}>
        <Image
          source={{ uri, height: thumbSize.height, width: thumbSize.width }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Modal
        visible={showModal}
        onRequestClose={handleRequestClose}
        onDismiss={handleRequestClose}
        animationType="fade"
        transparent={false}
        presentationStyle="fullScreen"
      >
        <ImageZoom
          cropHeight={windowDimen.height}
          cropWidth={windowDimen.width}
          imageHeight={windowDimen.height}
          imageWidth={windowDimen.width}
          enableSwipeDown={true}
          onSwipeDown={handleRequestClose}
        >
          <Image
            style={{
              width: windowDimen.width,
              height: windowDimen.height,
            }}
            source={{ uri: fullSizeUri(asset, cloudinaryInfo) }}
            resizeMode="contain"
          />
        </ImageZoom>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            // so that it is on top of the image.
            zIndex: 1000,
          }}
        >
          <Text
            style={{ textAlign: 'center', color: 'gray', fontStyle: 'italic' }}
          >
            swipe down to close
          </Text>
        </View>
      </Modal>
    </>
  );
};

export default ImageAsset;
