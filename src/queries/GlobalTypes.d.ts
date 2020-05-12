/**
 * Use `UNDEFINED` to un-set a previous value.
 */
export enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  UNDEFINED = 'UNDEFINED',
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}
