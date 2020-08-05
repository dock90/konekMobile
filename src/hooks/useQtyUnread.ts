import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { ROOMS_QUERY, RoomsQuery } from '../queries/RoomQueries';

export function useQtyUnread(): number {
  const { loading, data, error } = useQuery<RoomsQuery>(ROOMS_QUERY);

  return useMemo(() => {
    if (loading || error || !data || data.rooms.length == 0) {
      return 0;
    }

    let unread = 0;

    data.rooms.forEach((r) => {
      unread += r.qtyUnread;
    });

    return unread;
  }, [loading, data, error]);
}
