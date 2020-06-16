import { format, formatDistanceToNow, add } from 'date-fns';

const formatDateTime = (isoDT: string): string => {
  const date = new Date(isoDT);
  if (add(date, { days: 1 }) > new Date()) {
    return formatDistanceToNow(date) + ' ago';
  }

  return format(new Date(isoDT), 'PPPPpp');
};

export default formatDateTime;
