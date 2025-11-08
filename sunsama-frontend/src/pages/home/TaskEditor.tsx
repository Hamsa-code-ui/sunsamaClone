import './homepage.css'
import type { Dispatch, SetStateAction } from 'react'
import dayjs from 'dayjs'
import CalendarSelect from './CalendarSelect'

type EditorState = { open: boolean; dayId?: string; title?: string; tag?: string; timeEstimate?: number; description?: string }

type Props = {
    editor: EditorState;
    setEditor: Dispatch<SetStateAction<EditorState>>;
    closeEditor: () => void;
    saveEditor: () => void;
}

export default function TaskEditor({ editor, setEditor, closeEditor, saveEditor }: Props) {
    const dayString = editor.dayId
    const todayString = dayjs().format('YYYY-MM-DD')
    const todayInt = parseInt(todayString.replace(/-/g, ""), 10);
    const dayInt = parseInt((dayString ?? "").replace(/-/g, ""), 10);
    const differenz = dayInt - todayInt;
    let displayDate : string;
    if (dayInt === todayInt) {
        displayDate = "Today";
    } else if (differenz === 1) {
        displayDate = "Tomorrow";
    } else if (differenz === -1) {
        displayDate = "Yesterday";
    } else if (dayString) {
        displayDate = dayjs(dayString).format("dddd, MMM D");
    } else {
        displayDate = dayjs().format("dddd, MMM D");
    }
    console.log("Display date:", displayDate);

    return (
        <>
            <div className="editor-backdrop" onClick={closeEditor} />
            <div className="task-editor" role="dialog" aria-modal="true">
                <input
                    className="editor-title"
                    placeholder="Task title"
                    value={editor.title ?? ''}
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
                            <CalendarSelect value={editor.dayId} onSelect={(iso) => setEditor(s => ({ ...s, dayId: iso }))} />
                        </label>
                        <label className="editor-label">
                            <img src="/icons/clock.png" alt="Est. time" className='clock-icon' />
                            <select className="editor-select" value={editor.timeEstimate ?? 15} onChange={(e) => setEditor(s => ({ ...s, timeEstimate: Number(e.target.value) }))}>
                                <option value={15}>15</option>
                                <option value={30}>30</option>
                                <option value={45}>45</option>
                                <option value={60}>60</option>
                            </select>
                        </label>
                        <label className="editor-label">
                            Tag
                            <select className="editor-select" value={editor.tag ?? '# work'} onChange={(e) => setEditor(s => ({ ...s, tag: e.target.value }))}>
                                <option value="# work"># work</option>
                                <option value="# personal"># personal</option>
                                <option value="# errands"># errands</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}
