import { gql } from '@apollo/client';
import { ROLE_FIELDS } from './RoleQueries';
import { ASSET_FIELDS, AssetFieldsInterface } from './AssetQueries';

interface RoleInterface {
  __typename: 'Role';
  roleId: string;
  name: string;
}

interface ProfileInterface {
  /**
   * Room ID for direct messaging.
   */
  roomId: string;
}

export interface ContactInterface {
  __typename: 'Contact';
  contactId: string;
  name: string;
}

export interface MemberFieldsInterface {
  __typename: 'Member';
  /**
   * Name of contact to show in the chat UI. If the current user has permission to view the contact, the contact's name will be shown. If the member is an anonymous member, a random name will be shown otherwise the member's profile name.
   */
  name: string;
  /**
   * Unique ID of member inside the group.
   */
  memberId: string;
  picture: AssetFieldsInterface | null;
  /**
   * Role is only defined in groups.
   */
  role: RoleInterface | null;
  profile: ProfileInterface | null;
  /**
   * Preferred contact for DMs and group contact in groups.
   */
  contact: ContactInterface | null;
}

export const MEMBER_FIELDS = gql`
  fragment MemberFields on Member {
    __typename
    name
    memberId
    picture {
      ...AssetFields
    }
    role {
      ...RoleFields
    }
    profile {
      roomId
    }
    contact {
      __typename
      contactId
      name
    }
  }
  ${ROLE_FIELDS}
  ${ASSET_FIELDS}
`;

export const MEMBER_QUERY = gql`
  query MEMBER_QUERY($memberId: ID!, $roomId: ID!) {
    member(input: { memberId: $memberId, roomId: $roomId }) {
      ...MemberFields
    }
  }
  ${MEMBER_FIELDS}
`;
