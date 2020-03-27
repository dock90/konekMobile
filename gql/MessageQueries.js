import { gql } from '@apollo/client';
import { MEMBER_FIELDS } from "./MemberQueries";
import { ROOM_FIELDS } from "./RoomQueries";

const QUERY_FIELDS = gql`
  fragment MessageFields on Message {
    messageId
    body
    createdAt
    author {
      ...MemberFields
    }
    __typename
  }
  ${MEMBER_FIELDS}
`;

export const MESSAGES_QUERY = gql`
  query MESSAGES_QUERY($roomId: ID!, $after: String) {
    messages(input: { roomId: $roomId, after: $after, first: 45 }) {
      data {
        ...MessageFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${QUERY_FIELDS}
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SEND_MESSAGE_MUTATION($roomId: ID!, $body: String!) {
    sendMessage(input: { roomId: $roomId, body: $body }) {
      ...MessageFields
    }
  }
  ${QUERY_FIELDS}
`;

export const SET_READ_THROUGH = gql`
  mutation SET_READ_THROUGH($roomId: ID!, $messageId: ID!) {
    setReadThrough(input: { roomId: $roomId, messageId: $messageId }) {
      ...RoomFields
    }
  }
  ${ROOM_FIELDS}
`;
