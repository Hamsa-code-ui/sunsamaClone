import './homepage.css'
import type { DayItem } from './types'
import type { Dispatch, SetStateAction } from 'react'

type EditorState = { open: boolean; dayId?: string; title?: string; tag?: string; timeEstimate?: number }

type Props = {
    editor: EditorState;
    setEditor: Dispatch<SetStateAction<EditorState>>;
    closeEditor: () => void;
    saveEditor: () => void;
    days: DayItem[];
}

export default function TaskEditor({ editor, setEditor, closeEditor, saveEditor, days }: Props) {
    return (
        <>
            <div className="editor-backdrop" onClick={closeEditor} />
            <div className="task-editor" role="dialog" aria-modal="true">
                <input
                    className="editor-title"
                    placeholder="Task title"
                    value={editor.title}
                    onChange={(e) => setEditor(s => ({ ...s, title: e.target.value }))}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            closeEditor();
                        } else if (e.key === 'Enter') {
                            e.preventDefault();
                            saveEditor();
                        }
                    }}
                />
                <div className="editor-footer">
                    <div className="editor-left">
                        <label className="editor-label">
                            <img src="/icons/calendar.png" alt="calendar" />
                            <select className="editor-select" value={editor.dayId} onChange={(e) => setEditor(s => ({ ...s, dayId: e.target.value }))}>
                                {days.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className="editor-label">
                            Est. time
                            <select className="editor-select" value={editor.timeEstimate} onChange={(e) => setEditor(s => ({ ...s, timeEstimate: Number(e.target.value) }))}>
                                <option value={15}>15</option>
                                <option value={30}>30</option>
                                <option value={45}>45</option>
                                <option value={60}>60</option>
                            </select>
                        </label>
                        <label className="editor-label">
                            Tag
                            <select className="editor-select" value={editor.tag} onChange={(e) => setEditor(s => ({ ...s, tag: e.target.value }))}>
                                <option value="# work"># work</option>
                                <option value="# personal"># personal</option>
                                <option value="# errands"># errands</option>
                            </select>
                        </label>
                    </div>
                    <div className="editor-hint">Press Enter to add, Esc to cancel</div>
                </div>
            </div>
        </>
    )
}
