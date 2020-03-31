import { format } from 'date-fns'

const formatDateTime = (isoDT) => {
  return format(new Date(isoDT), 'p')
}

export default formatDateTime
