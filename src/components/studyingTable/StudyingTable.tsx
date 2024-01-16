import { useEffect, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
	getStudentData,
	getColumnData,
	getRateData,
	postRateData,
	deleteRateData,
} from '../../API/Service';
import { TableContext, TableContextProps } from '../../TableContext';
import { Column } from '../../Types/Column';
import { Student } from '../../Types/Student';
import { Rate } from '../../Types/Rate';
import { makeStyles, withStyles } from '@mui/styles';
import { Theme, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

const StyledTableCell = withStyles((theme: Theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white + ' !important',
		position: 'sticky',
		top: 0,
		zIndex: 100,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);

const useStyles = makeStyles({
	table: {
		minWidth: 700,
	},
	fixedColumn: {
		position: 'sticky',
		left: 0,
		zIndex: 1,
		backgroundColor: '#fff',
	},
});

const StudyingTable: React.FC = () => {
	const classes = useStyles();

	const { state, dispatch, showErrorSnackbar } = useContext<
		TableContextProps | undefined
	>(TableContext);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const schoolboyData = await getStudentData();
				const columnData = await getColumnData();
				const rateData = await getRateData();

				dispatch({
					type: 'SET_DATA',
					payload: { schoolboyData, columnData, rateData },
				});
			} catch (error) {
				showErrorSnackbar('Something went wrong');
				dispatch({
					type: 'SET_ERROR',
					payload: error || 'Something went wrong',
				});
			}
		};

		fetchData();
	}, [dispatch, showErrorSnackbar]);

	const handleCellClick = async (rowIndex: number, columnIndex: number) => {
		const schoolboyId = state.schoolboyData[rowIndex].Id;
		const columnId = state.columnData[columnIndex].Id;

		const existingRate = state.rateData.find(
			(rate: Rate) =>
				rate.SchoolboyId === schoolboyId && rate.ColumnId === columnId
		);

		if (existingRate) {
			await deleteRateData(schoolboyId, columnId);
		} else {
			await postRateData(schoolboyId, columnId, 'U+041d');
		}

		const updatedRateData = await getRateData();
		dispatch({
			type: 'SET_DATA',
			payload: { rateData: updatedRateData },
		});
	};

	function getFullName(student: Student) {
		let fullName = '';

		if (student.FirstName) {
			fullName += student.FirstName;
		}

		if (student.SecondName) {
			fullName += ' ' + student.SecondName;
		}

		if (student.LastName) {
			fullName += ' ' + student.LastName;
		}

		return fullName;
	}

	return (
		<ThemeProvider theme={theme}>
			<TableContainer
				style={{ overflowX: 'initial' }}
				component={Paper}
			>
				<Table
					className={classes.table}
					aria-label='customized table'
				>
					<TableHead>
						<TableRow>
							<StyledTableCell>#</StyledTableCell>
							<StyledTableCell>Student</StyledTableCell>
							{state.columnData.map((column: Column) => (
								<StyledTableCell
									style={{ textAlign: 'center' }}
									key={column.Id}
								>
									{column.Title}
								</StyledTableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{state.schoolboyData.map((student: Student, rowIndex: number) => {
							const fullName = getFullName(student);

							return (
								<TableRow key={student.Id}>
									<StyledTableCell className={classes.fixedColumn}>
										{rowIndex + 1}
									</StyledTableCell>
									<StyledTableCell className={classes.fixedColumn}>
										{fullName}
									</StyledTableCell>
									{state.columnData.map(
										(column: Column, columnIndex: number) => {
											const rate = state.rateData.find(
												(r: Rate) =>
													r.SchoolboyId === student.Id &&
													r.ColumnId === column.Id
											);
											return (
												<TableCell
													key={column.Id}
													onClick={() => handleCellClick(rowIndex, columnIndex)}
													style={{
														cursor: 'pointer',
														textAlign: 'center',
													}}
												>
													{rate ? 'Н' : ''}
												</TableCell>
											);
										}
									)}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</ThemeProvider>
	);
};

export default StudyingTable;
