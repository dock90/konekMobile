import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Modal, TouchableOpacity } from 'react-native';
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
        const scale = width / width;
        setThumbSize({ width: width, height: Math.round(height / scale) });
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
      </Modal>
    </>
  );
};

export default ImageAsset;
