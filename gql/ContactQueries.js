import { gql } from '@apollo/client';
import { ASSET_FIELDS } from "./AssetQueries";
import { PROFILE_FIELDS } from "./ProfileQueries";
import { TAG_FIELDS } from "./TagQueries";

const CONTACT_SUMMARY_FIELDS = gql`
  fragment ContactSummaryFields on Contact {
    __typename
    contactId
    name
    country
    picture {
      ...AssetFields
    }
    profile {
      roomId
    }
  }
  ${ASSET_FIELDS}
`;

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
    profile {
      ...ProfileFields
    }
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
  }
  ${TAG_FIELDS}
  ${ASSET_FIELDS}
  ${PROFILE_FIELDS}
`;

export const ALL_CONTACTS_QUERY = gql`
  query ALL_CONTACTS_QUERY {
    contacts {
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
    generateInvitationCode(input: {contactId: $contactId})
  }
`;
