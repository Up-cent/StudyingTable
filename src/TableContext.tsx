import React, { createContext, useReducer, Dispatch, useState } from 'react';
import { TableState } from './Types/TableState';
import { Action } from './Types/Action';
import Snackbar from '@mui/material/Snackbar';

export interface TableContextProps {
	state: TableState;
	dispatch: Dispatch<Action>;
	showErrorSnackbar: (message: string) => void;
}

export const TableContext = createContext<TableContextProps | undefined>(
	undefined
);

const tableReducer = (state: TableState, action: Action): TableState => {
	switch (action.type) {
		case 'SET_DATA':
			return { ...state, ...action.payload };
		case 'SET_ERROR':
			console.log(`Ошибка: ${action.payload}`);
			return state;
		default:
			return state;
	}
};

interface TableProviderProps {
	children: React.ReactNode;
}

export const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
	const initialState: TableState = {
		schoolboyData: [],
		columnData: [],
		rateData: [],
	};

	const [state, dispatch] = useReducer(tableReducer, initialState);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const showErrorSnackbar = (message: string) => {
		setSnackbarMessage(message);
		setSnackbarOpen(true);
	};

	const closeSnackbar = () => {
		setSnackbarOpen(false);
	};

	return (
		<TableContext.Provider value={{ state, dispatch, showErrorSnackbar }}>
			{children}

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={closeSnackbar}
				message={snackbarMessage}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			/>
		</TableContext.Provider>
	);
};
