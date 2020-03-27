import { gql } from '@apollo/client';

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

export const CREATE_TAG_MUTATION = gql`
  mutation CREATE_TAG_MUTATION($name: String!, $color: String!) {
    createTag(input: { name: $name, hidden: false, color: $color }) {
      ...TagFields
    }
  }
  ${TAG_FIELDS}
`;

export const UPDATE_TAG_MUTATION = gql`
  mutation UPDATE_TAG_MUTATION(
    $tagId: ID!
    $name: String
    $color: String
    $hidden: Boolean
  ) {
    updateTag(
      input: { tagId: $tagId, name: $name, color: $color, hidden: $hidden }
    ) {
      ...TagFields
    }
  }
  ${TAG_FIELDS}
`;
