import type { DataModel } from '../../../convex/_generated/dataModel'

// Derive the Project and Subtask types from Convex's generated DataModel.
export type Project = DataModel['projects']['document'];
export type Subtask = Project['subtasks'][number];

export type DayItem = {
    id: string;
    name: string;
    date: string;
    fullDate: Date;
}
