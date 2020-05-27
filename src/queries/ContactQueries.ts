import { gql } from '@apollo/client';
import { Gender, PageInfo } from './GlobalTypes';
import { RoleFieldsInterface } from './RoleQueries';
import { TAG_FIELDS, TagFieldsInterface } from './TagQueries';
import { ASSET_FIELDS, AssetFieldsInterface } from './AssetQueries';

export interface EmailsFields {
  email: string;
  label: string | null;
}

export interface PhonesFields {
  number: string;
  label: string | null;
}

export interface ContactSummaryFieldsInterface {
  __typename: 'Contact';
  contactId: string;
  name: string;
  country: string | null;
  picture: AssetFieldsInterface | null;
  tags: TagFieldsInterface[] | null;
  profile: { roomId: string | null } | null;
}
const CONTACT_SUMMARY_FIELDS = gql`
  fragment ContactSummaryFields on Contact {
    __typename
    contactId
    name
    country
    picture {
      ...AssetFields
    }
    tags {
      ...TagFields
    }
    profile {
      roomId
    }
  }
  ${ASSET_FIELDS}
  ${TAG_FIELDS}
`;
export interface ContactFieldsGroups {
  group: {
    __typename: 'Group';
    groupId: string;
    name: string;
  };
  role: RoleFieldsInterface;
}
export interface ContactFields {
  __typename: 'Contact';
  contactId: string;
  name: string;
  legalName: string | null;
  picture: AssetFieldsInterface | null;
  /**
   * Folder where all contact specific assets should be stored. (This includes note assets.)
   */
  assetFolderId: string;
  /**
   * A brief description of the contact for quick reference.
   */
  bio: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  gender: Gender | null;
  language: string | null;
  invitationCode: string | null;
  tags: TagFieldsInterface[] | null;
  fbProfile: string | null;
  emails: EmailsFields[];
  phones: PhonesFields[];
  groups: ContactFieldsGroups[];
  profile: {
    roomId: string;
  };
}
const CONTACT_FIELDS = gql`
  fragment ContactFields on Contact {
    __typename
    contactId
    name
    legalName
    picture {
      ...AssetFields
    }
    assetFolderId
    bio
    city
    state
    postalCode
    country
    gender
    language
    invitationCode
    tags {
      ...TagFields
    }
    bio
    fbProfile
    emails {
      email
      label
    }
    phones {
      number
      label
    }
    groups {
      group {
        __typename
        groupId
        name
      }
      role {
        roleId
      }
    }
    profile {
      roomId
    }
  }
  ${TAG_FIELDS}
  ${ASSET_FIELDS}
`;

export interface AllContactsQueryResults {
  /**
   * All available contacts
   */
  contacts: {
    data: ContactSummaryFieldsInterface[];
    pageInfo: PageInfo;
  };
}
export interface AllContactsQueryVariables {
  tags?: string[] | null;
}

export const ALL_CONTACTS_QUERY = gql`
  query ALL_CONTACTS_QUERY($tags: [ID!]) {
    contacts(tags: $tags, messageOnly: true) {
      data {
        ...ContactSummaryFields
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${CONTACT_SUMMARY_FIELDS}
`;

export interface ContactsQueryResults {
  /**
   * Load a single contact
   */
  contact: ContactFields;
}
export interface ContactsQueryVariables {
  contactId: string;
}

export const CONTACT_QUERY = gql`
  query CONTACT_QUERY($contactId: ID!) {
    contact(contactId: $contactId) {
      ...ContactFields
    }
  }
  ${CONTACT_FIELDS}
`;

export const UPDATE_CONTACT_MUTATION = gql`
  mutation UPDATE_CONTACT_MUTATION(
    $contactId: ID!
    $name: String
    $legalName: String
    $bio: String
    $city: String
    $state: String
    $postalCode: String
    $country: String
    $language: String
    $fbProfile: String
    $phones: [PhoneInput!]
    $emails: [EmailInput!]
    $picture: AssetInput
    $gender: Gender
    $tags: [ID!]
  ) {
    updateContact(
      input: {
        contactId: $contactId
        name: $name
        legalName: $legalName
        bio: $bio
        city: $city
        state: $state
        postalCode: $postalCode
        country: $country
        language: $language
        fbProfile: $fbProfile
        phones: $phones
        emails: $emails
        picture: $picture
        gender: $gender
        tags: $tags
      }
    ) {
      ...ContactFields
    }
  }
  ${CONTACT_FIELDS}
`;

export const CREATE_CONTACT_MUTATION = gql`
  mutation CREATE_CONTACT_MUTATION(
    $name: String!
    $legalName: String
    $bio: String
    $city: String
    $state: String
    $postalCode: String
    $country: String
    $language: String
    $fbProfile: String
    $groups: [ContactGroupInput!]!
    $phones: [PhoneInput!]
    $emails: [EmailInput!]
  ) {
    createContact(
      input: {
        name: $name
        legalName: $legalName
        bio: $bio
        city: $city
        state: $state
        postalCode: $postalCode
        country: $country
        language: $language
        fbProfile: $fbProfile
        groups: $groups
        phones: $phones
        emails: $emails
      }
    ) {
      ...ContactFields
    }
  }
  ${CONTACT_FIELDS}
`;

export const UPDATE_CONTACT_GROUP = gql`
  mutation UPDATE_CONTACT_GROUP($contactId: ID!, $groupId: ID!, $roleId: ID!) {
    updateContactGroup(
      input: { contactId: $contactId, groupId: $groupId, roleId: $roleId }
    ) {
      ...ContactFields
    }
  }
  ${CONTACT_FIELDS}
`;

export const REMOVE_CONTACT_GROUP = gql`
  mutation REMOVE_CONTACT_GROUP($contactId: ID!, $groupId: ID!) {
    removeContactGroup(input: { contactId: $contactId, groupId: $groupId }) {
      ...ContactFields
    }
  }
  ${CONTACT_FIELDS}
`;

export const ADD_CONTACT_GROUP = gql`
  mutation ADD_CONTACT_GROUP($contactId: ID!, $groupId: ID!, $roleId: ID!) {
    addContactGroup(
      input: { contactId: $contactId, groupId: $groupId, roleId: $roleId }
    ) {
      ...ContactFields
    }
  }
  ${CONTACT_FIELDS}
`;

export const GENERATE_INVITATION_CODE = gql`
  mutation GENERATE_INVITATION_CODE($contactId: ID!) {
    generateInvitationCode(input: { contactId: $contactId })
  }
`;
