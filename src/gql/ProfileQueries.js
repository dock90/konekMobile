import { gql } from '@apollo/client';
import { ASSET_FIELDS } from './AssetQueries';

export const PROFILE_FIELDS = gql`
  fragment ProfileFields on Profile {
    __typename
    profileId
    name
    roomId
    picture {
      ...AssetFields
    }
    emails {
      email
      label
    }
    phones {
      number
      label
    }
    city
    state
    postalCode
    country
    language
  }
  ${ASSET_FIELDS}
`;
