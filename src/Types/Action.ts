import { TableState } from '../Types/TableState';

export type Action =
| { type: 'SET_DATA'; payload: Partial<TableState> }
| { type: 'SET_ERROR'; payload: string };