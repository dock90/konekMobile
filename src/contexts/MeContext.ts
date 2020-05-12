import { createContext } from 'react';
import { MeFieldsInterface } from '../queries/MeQueries';

export const MeContext = createContext<MeFieldsInterface | undefined>(
  undefined
);
