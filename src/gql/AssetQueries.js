import { gql } from '@apollo/client';

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
