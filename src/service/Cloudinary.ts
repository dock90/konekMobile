import { client } from '../config/Apollo';
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

  console.log(file);

  const data = new FormData();
  data.append('timestamp', toSign.timestamp);
  data.append('api_key', config.apiKey);
  data.append('file', file);
  data.append('signature', signed.data.signUpload);
  data.append('folder', config.folder);
  data.append('tags', tags);

  const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/${config.resourceType}/upload`;

  let resData;
  try {
    const response = await fetch(url, {
      method: 'post',
      body: data,
    });
    resData = await response.json();
  } catch (e) {
    console.log(e);
  }

  console.log(resData);

  return {
    format: resData.format,
    publicId: resData.public_id,
    resourceType: resData.resource_type,
    type: resData.type,
    isAudio: !!resData.is_audio,
    originalFilename: null,
  };
}
