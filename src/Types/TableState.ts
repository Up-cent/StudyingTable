import { Column } from "./Column";
import { Rate } from "./Rate";
import { Student } from "./Student";

export interface TableState {
	schoolboyData: Student[];
	columnData: Column[];
	rateData: Rate[];
}