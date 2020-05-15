import { gql } from '@apollo/client';
import { ASSET_FIELDS, AssetFieldsInterface } from './AssetQueries';

export interface RoomFieldsInterface {
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
  picture: AssetFieldsInterface | null;
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
  rooms: Array<RoomFieldsInterface>;
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
  room: RoomFieldsInterface;
}
export interface RoomQueryVariables {
  roomId: string;
}
export const ROOM_QUERY = gql`
  query ROOM_QUERY($roomId: ID!) {
    room(roomId: $roomId) {
      ...RoomFields
    }
  }
  ${ROOM_FIELDS}
`;
