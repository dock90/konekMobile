import { gql } from '@apollo/client';
import {
  ASSET_FIELDS,
  AssetFieldsInterface,
  AssetInterface,
} from './AssetQueries';
import { PageInfo } from './GlobalTypes';
import { MEMBER_FIELDS, MemberFieldsInterface } from './MemberQueries';
import { ROOM_FIELDS } from './RoomQueries';

export interface MessageFieldsInterface {
  __typename: 'Message';
  messageId: string;
  body: string | null;
  createdAt: string;
  asset: AssetFieldsInterface | null;
  author: MemberFieldsInterface;
}

const MessageFields = gql`
  fragment MessageFields on Message {
    __typename
    messageId
    body
    createdAt
    asset {
      ...AssetFields
    }
    author {
      ...MemberFields
    }
  }
  ${MEMBER_FIELDS}
  ${ASSET_FIELDS}
`;

export interface MessageQueryVariables {
  roomId: string;
  after?: string | null;
  first?: number;
}
export interface MessagesQueryInterface {
  messages: {
    data: Array<MessageFieldsInterface>;
    pageInfo: PageInfo;
  };
}
export const MESSAGES_QUERY = gql`
  query MESSAGES_QUERY($roomId: ID!, $after: String) {
    messages(input: { roomId: $roomId, after: $after, first: 100 }) {
      data {
        ...MessageFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${MessageFields}
`;

export interface SendMessageMutationVariables {
  roomId: string;
  body: string;
  asset?: AssetInterface;
}
export interface SendMessageMutationResult {
  sendMessage: MessageFieldsInterface;
}
export const SEND_MESSAGE_MUTATION = gql`
  mutation SEND_MESSAGE_MUTATION(
    $roomId: ID!
    $body: String!
    $asset: AssetInput
  ) {
    sendMessage(input: { roomId: $roomId, body: $body, asset: $asset }) {
      ...MessageFields
    }
  }
  ${MessageFields}
`;

export const SET_READ_THROUGH = gql`
  mutation SET_READ_THROUGH($roomId: ID!, $messageId: ID!) {
    setReadThrough(input: { roomId: $roomId, messageId: $messageId }) {
      ...RoomFields
    }
  }
  ${ROOM_FIELDS}
`;
