import { gql } from '@apollo/client';
import { ASSET_FIELDS, AssetFields } from './AssetQueries';

export interface RoomFields {
  __typename: 'Room';
  roomId: string;
  /**
   * Name of the room to show in the UI
   */
  name: string;
  qtyUnread: number;
  /**
   * Own member ID in room
   */
  memberId: string;
  /**
   * ID of the last message read.
   */
  readThrough: string | null;
  picture: AssetFields | null;
}
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

export interface RoomsQuery {
  rooms: Array<RoomFields>;
}
export const ROOMS_QUERY = gql`
  query ROOMS_QUERY {
    rooms {
      ...RoomFields
    }
  }
  ${ROOM_FIELDS}
`;

export interface RoomQuery {
  room: RoomFields;
}
export const ROOM_QUERY = gql`
  query ROOM_QUERY($roomId: ID!) {
    room(roomId: $roomId) {
      ...RoomFields
    }
  }
  ${ROOM_FIELDS}
`;
