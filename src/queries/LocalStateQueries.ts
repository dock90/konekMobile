import { gql } from '@apollo/client';

export const PUB_NUB_CONNECTION_STATE_QUERY = gql`
  query {
    pnConnected @client(always: true)
  }
`;
