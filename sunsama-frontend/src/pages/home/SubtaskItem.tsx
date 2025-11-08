import type { Subtask } from './types'
import './homepage.css'

type Props = {
    projectId: string;
    subtask: Subtask;
    inFlight: boolean;
    onToggle: (projectId: string, subtaskTitle: string) => void;
}

export default function SubtaskItem({ projectId, subtask, inFlight, onToggle }: Props) {
    return (
        <div className="subtask">
            <img
                className="subtask-icon"
                src={subtask.isDone ? '/icons/checked-mark.png' : '/icons/unchecked-mark.png'}
                alt={subtask.isDone ? 'checked' : 'unchecked'}
                aria-busy={inFlight}
                onClick={() => { if (!inFlight) onToggle(projectId, subtask.title) }}
            />
            <div className="subtask-title">{subtask.title}</div>
        </div>
    )
}
