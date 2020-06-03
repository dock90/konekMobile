import { gql } from '@apollo/client';
import { ASSET_FIELDS, AssetFieldsInterface } from './AssetQueries';
import { EmailsFields, PhonesFields } from './ContactQueries';

export interface PubNubInfo {
  /**
   * `subscribeKey` used when initializing PubNub
   */
  subscribeKey: string;
  /**
   * `authKey` used when initializing PubNub. A new key will be generated when close to expiration.
   */
  authKey: string;
  /**
   * New keys are valid for 5 days.
   */
  expires: string;
  /**
   * Channel group to subscribe to.
   */
  channelGroup: string;
  channels: Array<string>;
}

export interface AlgoliaInfo {
  appId: string;
  /**
   * Key for searching. Will be null if contact does not have access to anything
   */
  searchKey: string | null;
}

export interface CloudinaryInfo {
  cloudName: string;
  apiKey: string;
}

export interface Access {
  timeline: boolean;
  contacts: boolean;
  messages: boolean;
  groups: boolean;
  hasContact: boolean;
}

export interface MeFieldsInterface {
  __typename: 'Me';
  name: string;
  picture?: AssetFieldsInterface | null;
  /**
   * Folder where all profile specific assets should be stored.
   */
  assetFolderId: string;
  emails: EmailsFields[];
  phones: PhonesFields[];
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  language: string | null;
  pubNubInfo: PubNubInfo;
  algoliaInfo: AlgoliaInfo;
  cloudinaryInfo: CloudinaryInfo;
  access: Access;
}
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
      channels
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

export interface MeQueryInterface {
  me: MeFieldsInterface;
}
// ME_QUERY
export const ME_QUERY = gql`
  query ME_QUERY {
    me {
      ...MeFields
    }
  }
  ${ME_FIELDS}
`;
