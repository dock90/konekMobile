import { gql } from '@apollo/client';

export interface TagFieldsInterface {
  __typename: 'Tag';
  tagId: string;
  name: string;
  /**
   * Color of the tag in the UI.
   */
  color: string;
  /**
   * If the tag should be unavailable for adding to an entity. (It may still exist where previously used.)
   */
  hidden: boolean;
}
export const TAG_FIELDS = gql`
  fragment TagFields on Tag {
    __typename
    tagId
    name
    color
    hidden
  }
`;

export const TAGS_QUERY = gql`
  query TAGS_QUERY {
    tags {
      ...TagFields
    }
  }
  ${TAG_FIELDS}
`;
