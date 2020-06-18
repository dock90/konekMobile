import { ApolloError, useQuery } from '@apollo/client';
import {
  ME_QUERY,
  MeFieldsInterface,
  MeQueryInterface,
} from '../queries/MeQueries';

export interface UseMeReturn {
  me: MeFieldsInterface;
  loading: boolean;
  error?: ApolloError;
  refresh: () => Promise<void>;
}
export function useMe(): UseMeReturn {
  const { data, loading, error, refetch } = useQuery<MeQueryInterface>(
    ME_QUERY
  );

  const me = (data?.me ? data.me : {}) as MeFieldsInterface;

  return {
    me,
    loading,
    error,
    refresh: async (): Promise<void> => {
      await refetch();
    },
  };
}
