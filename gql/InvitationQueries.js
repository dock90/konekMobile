import { gql } from '@apollo/client';
import { ME_FIELDS } from "./MeQueries";

export const ACCEPT_INVITATION_MUTATION = gql`
  mutation ACCEPT_INVITATION_MUTATION ($code: String!) {
    acceptInvitation(code: $code) {
      ...MeFields
    }
  }
  ${ME_FIELDS}
`;
