import { gql } from '@apollo/client';
import { ASSET_FIELDS } from './AssetQueries'

export const ME_FIELDS = gql`
  fragment MeFields on Me {
    __typename
    name
    picture {
      ...AssetFields
    }
    assetFolderId
    emails {
      email
      label
    }
    phones {
      number
      label
    }
    city
    state
    postalCode
    country
    language
    pubNubInfo {
      subscribeKey
      authKey
      expires
      channelGroup
    }
    algoliaInfo {
      appId
      searchKey
    }
    cloudinaryInfo {
      cloudName
      apiKey
    }
    access {
      timeline
      contacts
      messages
      groups
      hasContact
    }
  }
  ${ASSET_FIELDS}
`;

// ME_QUERY
export const ME_QUERY = gql`
  query ME_QUERY {
    me {
      ...MeFields
    }
  }
  ${ME_FIELDS}
`;
