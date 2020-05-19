import { gql } from '@apollo/client';

export interface AssetInterface {
  format: string | null;
  publicId: string;
  resourceType: 'video' | 'image' | 'raw';
  type: string;
  originalFilename: string | null;
  /**
   * If the asset is audio only. Only applicable to the "video" resource type.
   */
  isAudio: boolean;
}

export interface AssetFieldsInterface extends AssetInterface {
  __typename: 'Asset';
}
export const ASSET_FIELDS = gql`
  fragment AssetFields on Asset {
    __typename
    format
    publicId
    resourceType
    type
    originalFilename
    isAudio
  }
`;
export interface SignArgsMutationResultInterface {
  signUpload: string;
}
export interface SignArgsMutationArguments {
  args: { [key: string]: unknown };
}
export const SIGN_ARGS_MUTATION = gql`
  mutation SIGN_ARGS_MUTATION($args: ParamsToSign!) {
    signUpload(argToSign: $args)
  }
`;
