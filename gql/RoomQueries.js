import { gql } from '@apollo/client';
import { ASSET_FIELDS } from "./AssetQueries";

export const ROOM_FIELDS = gql`
  fragment RoomFields on Room {
    __typename
    roomId
    name
    qtyUnread
    memberId
    readThrough
    picture {
      ...AssetFields
    }
  }
  ${ASSET_FIELDS}
`;

export const ROOMS_QUERY = gql`
  query ROOMS_QUERY {
    rooms {
      ...RoomFields
    }
  }
  ${ROOM_FIELDS}
`;

export const ROOM_QUERY = gql`
  query ROOM_QUERY($roomId: ID!) {
    room(roomId: $roomId) {
      ...RoomFields
    }
  }
  ${ROOM_FIELDS}
`;
