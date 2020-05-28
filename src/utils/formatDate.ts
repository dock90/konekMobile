import { format } from 'date-fns';

const formatDateTime = (isoDT: string): string => {
  return format(new Date(isoDT), 'p');
};

export default formatDateTime;
