import { gql } from '@apollo/client';

export interface AssetInterface {
  format: string | null;
  publicId: string;
  resourceType: string;
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
