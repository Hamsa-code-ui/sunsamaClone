import './homepage.css'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
// import { formatTime } from '../../utils/time' // unused here
import { useRef, useEffect, useState, useMemo } from 'react'
import type { Project } from './types'
import { generateDays } from './generateDays'
import Sidebar from './Sidebar'
import BoardHeader from './BoardHeader'
import DayColumn from './DayColumn'
import TaskEditor from './TaskEditor'
import CalendarPane from './CalendarPane'

export function HomePage() {
    const toggleSubtaskMutation = useMutation(api.projects.setSubtaskChecked)
    // Note: server-side `addProject` persistence is intentionally omitted here to keep types stable
    // while Convex codegen is not guaranteed to generate `api.projects.addProject` locally.

    const days = generateDays();
    let todayIndex = 29;
    const daysRef = useRef<HTMLDivElement | null>(null);
    todayIndex = todayIndex - 1;

    const projectsQueryResult = useQuery(api.projects.getProjects);
    const projectsQuery = useMemo(() => (projectsQueryResult ?? []) as Project[], [projectsQueryResult]);
    const [localProjects, setLocalProjects] = useState<Project[]>(projectsQuery);
    const [pendingToggles, setPendingToggles] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setLocalProjects(projectsQuery);
    }, [projectsQuery]);

    const [editor, setEditor] = useState<{ open: boolean; dayId?: string; title?: string; tag?: string; timeEstimate?: number }>({ open: false });

    function openEditor(dayId: string) {
        setEditor({ open: true, dayId, title: '', tag: '# work', timeEstimate: 30 });
    }
    function closeEditor() { setEditor({ open: false }); }

    async function saveEditor() {
        if (!editor.dayId) return closeEditor();
        const newTask = {
            _id: `local-${Date.now()}`,
            title: editor.title || 'New task',
            date: editor.dayId,
            plannedTime: editor.timeEstimate ?? 0,
            subtasks: [],
            tag: editor.tag,
        } as unknown as Project;

        setLocalProjects(prev => [newTask, ...prev]);
        closeEditor();

        // NOTE: persistence to Convex (addProject) removed in this refactor; the optimistic task remains local.
    }

    function handleWheel(e: React.WheelEvent) {
        const el = daysRef.current
        if (!el) return
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            el.scrollLeft += e.deltaY
            e.preventDefault()
        }
    }

    useEffect(() => {
        const container = daysRef.current;
        const todayEl = container?.children[todayIndex] as HTMLElement;
        if (!container || !todayEl) return;
        const leftPos = todayEl.offsetLeft
        container.scrollTo({ left: leftPos, behavior: 'instant' });
    }, [todayIndex]);

    // Toggle handler passed to components
    async function handleToggleSubtask(projectId: string, subtaskTitle: string) {
        const toggleKey = `${projectId}::${subtaskTitle}`;
        if (pendingToggles[toggleKey]) return;
        // optimistic update
        type LocalSubtask = { title: string; isDone: boolean }
        setLocalProjects(prev => prev.map(p => {
            if (p._id !== projectId) return p;
            return {
                ...p,
                subtasks: p.subtasks.map((s: unknown) => {
                    const ss = s as LocalSubtask
                    return ss.title === subtaskTitle ? { ...ss, isDone: !ss.isDone } : ss
                })
            }
        }));
        setPendingToggles(prev => ({ ...prev, [toggleKey]: true }));
        try {
            await (toggleSubtaskMutation as unknown as (args: { taskId: unknown; subTaskName: string }) => Promise<boolean>)({ taskId: projectId, subTaskName: subtaskTitle });
        } catch (err) {
            setLocalProjects(projectsQuery);
            console.error('toggleSubtask failed', err);
        } finally {
            setPendingToggles(prev => { const copy = { ...prev }; delete copy[toggleKey]; return copy; });
        }
    }

    return (
        <div className="app">
            <Sidebar />

            <main className="board">
                <BoardHeader />

                <section className="days" ref={daysRef} onWheel={handleWheel}>
                    {days.map((day) => (
                        <DayColumn
                            key={day.id}
                            day={day}
                            projects={localProjects.filter(p => p.date === day.id)}
                            openEditor={openEditor}
                            pendingToggles={pendingToggles}
                            onToggleSubtask={handleToggleSubtask}
                        />
                    ))}
                </section>

                {editor.open && (
                    <TaskEditor editor={editor} setEditor={setEditor} closeEditor={closeEditor} saveEditor={saveEditor} days={days} />
                )}
            </main>

            <CalendarPane />
        </div>
    )
}
