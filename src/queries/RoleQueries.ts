import { gql } from '@apollo/client';

export interface RoleFieldsInterface {
  __typename: 'Role';
  roleId: string;
  name: string;
}

export const ROLE_FIELDS = gql`
  fragment RoleFields on Role {
    __typename
    roleId
    name
  }
`;

export const ROLES_QUERY = gql`
  query ROLES_QUERY {
    roles {
      ...RoleFields
    }
  }
  ${ROLE_FIELDS}
`;
