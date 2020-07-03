import { gql } from '@apollo/client';
import {
  ASSET_FIELDS,
  AssetFieldsInterface,
  AssetInterface,
} from './AssetQueries';
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
  city: string;
  state: string;
  postalCode: string;
  country: string;
  language: string;
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

export interface UpdateMeMutationInterface {
  updateMe: MeFieldsInterface;
}

export interface UpdateMeMutationVariables {
  name?: string;
  picture?: AssetInterface | null;
  // emails?: EmailInput[];
  // phones?: PhoneInput[];
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  language?: string;
}

// UPDATE_ME_MUTATION
export const UPDATE_ME_MUTATION = gql`
  mutation UPDATE_ME_MUTATION(
    $name: String
    $picture: AssetInput
    $emails: [EmailInput!]
    $phones: [PhoneInput!]
    $city: String
    $state: String
    $country: String
    $postalCode: String
    $language: String
  ) {
    updateMe(
      input: {
        name: $name
        picture: $picture
        emails: $emails
        phones: $phones
        city: $city
        state: $state
        country: $country
        postalCode: $postalCode
        language: $language
      }
    ) {
      ...MeFields
    }
  }
  ${ME_FIELDS}
`;
