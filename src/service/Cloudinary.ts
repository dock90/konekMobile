import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { client } from '../config/Apollo';
import { BugSnag } from '../config/BugSnag';
import {
  AssetInterface,
  SIGN_ARGS_MUTATION,
  SignArgsMutationArguments,
  SignArgsMutationResultInterface,
} from '../queries/AssetQueries';

interface ConfigInterface {
  apiKey: string;
  cloudName: string;
  resourceType: string;
  folder: string;
  tags?: string[];
}

interface FileInterface {
  uri: string;
  name: string;
  type: string;
}

export async function uploadFile(
  config: ConfigInterface,
  file: FileInterface
): Promise<AssetInterface> {
  let tags = '';
  if (config.tags && config.tags.length > 0) {
    tags = config.tags.join(',');
  }

  const toSign = {
    folder: config.folder,
    tags,
    timestamp: Math.round(Date.now() / 1000),
  };

  const signed = await client.mutate<
    SignArgsMutationResultInterface,
    SignArgsMutationArguments
  >({
    mutation: SIGN_ARGS_MUTATION,
    variables: { args: toSign },
  });

  const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/${config.resourceType}/upload`;

  let resData;
  try {
    const response = await RNFetchBlob.fetch(
      'POST',
      url,
      {
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'file',
          filename: file.name,
          type: file.type,
          data: RNFetchBlob.wrap(
            Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri
          ),
        },
        { name: 'timestamp', data: toSign.timestamp.toString(10) },
        { name: 'api_key', data: config.apiKey },
        { name: 'signature', data: signed.data?.signUpload },
        { name: 'folder', data: config.folder },
        { name: 'tags', data: tags },
      ]
    );

    resData = await response.json();
  } catch (e) {
    BugSnag && BugSnag.notify(e);
    console.log(e);
    throw e;
  }

  return {
    format: resData.format,
    publicId: resData.public_id,
    resourceType: resData.resource_type,
    type: resData.type,
    isAudio: !!resData.is_audio,
    originalFilename: null,
  };
}
