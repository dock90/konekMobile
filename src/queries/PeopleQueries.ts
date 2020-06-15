import { gql } from '@apollo/client';
import { ASSET_FIELDS, AssetFieldsInterface } from './AssetQueries';

export function personKeyExtractor(person: PersonFieldsInterface): string {
  return person.contactId ? person.contactId : person.profileId;
}

export interface PersonFieldsInterface {
  __typename: 'Person';
  name: string;
  contactId: string | null;
  profileId: string;
  picture: AssetFieldsInterface | null;
  roomId: string;
}

export interface PeopleQueryResults {
  /**
   * List of contacts and profiles that current profile can message
   */
  people: PersonFieldsInterface[];
}

export const PEOPLE_QUERY = gql`
  query PEOPLE_QUERY {
    people {
      __typename
      name
      contactId
      profileId
      picture {
        ...AssetFields
      }
      roomId
    }
  }
  ${ASSET_FIELDS}
`;
