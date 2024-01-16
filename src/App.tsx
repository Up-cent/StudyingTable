import StudyingTable from './components/studyingTable/StudyingTable';
import { TableProvider } from './TableContext';

export default function App() {
	return (
		<TableProvider>
			<StudyingTable />
		</TableProvider>
	);
}
