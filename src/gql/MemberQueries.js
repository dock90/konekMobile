import { gql } from '@apollo/client';
import { ROLE_FIELDS } from './RoleQueries';
import { ASSET_FIELDS } from './AssetQueries';

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
