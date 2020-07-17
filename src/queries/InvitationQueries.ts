import { gql } from '@apollo/client';
import { ME_FIELDS, MeFieldsInterface } from './MeQueries';

export interface AcceptInvitationMutationResult {
  acceptInvitation: null | MeFieldsInterface;
}

export const ACCEPT_INVITATION_MUTATION = gql`
  mutation ACCEPT_INVITATION_MUTATION($code: String!) {
    acceptInvitation(code: $code) {
      ...MeFields
    }
  }
  ${ME_FIELDS}
`;
