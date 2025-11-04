import './homepage.css'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { formatTime } from '../../utils/time'
import { useRef, useEffect, useState, useMemo } from 'react'
import type { DataModel } from '../../../convex/_generated/dataModel'
import ProgressBar from './ProgressBar'

// Derive the Project and Subtask types from Convex's generated DataModel.
type Project = DataModel["projects"]["document"];
type Subtask = Project["subtasks"][number];

export function HomePage() {
    const toggleSubtask = useMutation(api.projects.setSubtaskChecked)


    // utils/generateDays.ts
    function generateDays(center = new Date(), daysBefore = 30, daysAfter = 30) {
        const result: {
            id: string;
            name: string;
            date: string;
            fullDate: Date
        }[] = [];
        const start = new Date(center);
        start.setDate(start.getDate() - daysBefore);


        for (let i = 0; i <= daysBefore + daysAfter; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            result.push({
                id: d.toISOString().split("T")[0],
                name: d.toLocaleDateString("de-DE", { weekday: "long" }),
                date: d.toLocaleDateString("de-DE", { day: "2-digit", month: "long" }),
                fullDate: d
            });

        }

        return result;

    }


    const days = generateDays();
    let todayIndex = 29; // we generated 30 days before and 30 after, use index 29 (0-based) to show today
    const daysRef = useRef<HTMLDivElement | null>(null);
    //const [selectedDate, setSelectedDate] = useState(days[todayIndex].id);
    todayIndex = todayIndex - 1;

    /*interface Project {
        _id: v.id;
        title: string;
        date?: string;
        plannedTime?: number;
        subtasks: Subtask[];
        // add more fields here if your project objects include them
    }*/

    // The generated `api` typings may be empty locally if Convex's codegen hasn't run.
    // Call the query and keep an optimistic local copy for immediate UI updates.
    const projectsQueryResult = useQuery(api.projects.getProjects);
    const projectsQuery = useMemo(() => (projectsQueryResult ?? []) as Project[], [projectsQueryResult]);
    const [localProjects, setLocalProjects] = useState<Project[]>(projectsQuery);
    // Track pending toggles to avoid duplicate requests and repeated flips.
    const [pendingToggles, setPendingToggles] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setLocalProjects(projectsQuery);
    }, [projectsQuery]);





    // const days = useQuery(api.daysData.da, { totalDays: 60 }) || []


    function handleWheel(e: React.WheelEvent) {
        const el = daysRef.current
        if (!el) return

        // If the wheel movement is primarily vertical, scroll horizontally.
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            el.scrollLeft += e.deltaY
            e.preventDefault()
        }
    }

    useEffect(() => {
        const container = daysRef.current;
        const todayEl = container?.children[todayIndex] as HTMLElement;
        if (!container || !todayEl) return;


        // Abstand zwischen Element und Container-Linker Kante
        //const elementOffset = todayRect.left - containerRect.left;

        // Ziel: Element-Mitte in Container-Mitte

        const leftPos = todayEl.offsetLeft

        container.scrollTo({
            left: leftPos,
            behavior: "instant", // or "smooth"
        });
    }, [todayIndex]);

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="logo">Sunsama</div>
                <nav className="main-nav">
                    <a className="nav-item active">Home</a>
                    <a className="nav-item">Today</a>
                    <a className="nav-item">Focus</a>

                    <div className="section">Daily rituals</div>
                    <a className="nav-item">Daily planning</a>
                    <a className="nav-item">Daily shutdown</a>
                    <a className="nav-item">Daily highlights</a>

                    <div className="section">Weekly rituals</div>
                    <a className="nav-item">Weekly planning</a>
                    <a className="nav-item">Weekly review</a>
                </nav>

                <div className="invite">+ Invite someone</div>
            </aside>

            <main className="board">
                <header className="board-header">
                    <div className="left-controls">
                        <button className="btn small">Today</button>
                        <button className="btn small ghost">Filter</button>
                    </div>
                </header>

                <section className="days" ref={daysRef} onWheel={handleWheel}>
                    {days.map((day) => {
                        return (
                            <div className="day-col" key={day.date + day.name}>
                                <div className="day-head">
                                    <div className="day-name">{day.name}</div>
                                    <div className="day-date">{day.date}</div>
                                </div>
                                <div className="add-task">+ Add task</div>
                                {localProjects.map((project: Project) => {
                                    const total = project.subtasks?.length || 0;
                                    const done = project.subtasks?.filter((s : Subtask) => s.isDone).length || 0;
                                    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

                                    if (project.date === day.id) {
                                        return (
                                            <div className="task" key={project._id}>
                                                <div className="task-project">
                                                    <div className='task-header'>
                                                        <div className="task-name">{project.title}</div>
                                                        <div className="time-badge">{formatTime(project.plannedTime ?? 0)}</div>
                                                    </div>
                                                    <ProgressBar progress={progress} />
                                                    <div className='task-middlesection'>
                                                        {project.subtasks?.map((subtask: Subtask, idx: number) => {
                                                            const toggleKey = `${project._id}::${subtask.title}`;
                                                            const inFlight = !!pendingToggles[toggleKey];
                                                            return (
                                                                <div className="subtask" key={idx}>
                                                                    <img
                                                                        //className='subtask-checked-btn'
                                                                        //disabled={inFlight}
                                                                        className="subtask-icon" src={
                                                                            subtask.isDone
                                                                                ? "/icons/checked-mark.png"
                                                                                : "/icons/unchecked-mark.png"}
                                                                        alt={subtask.isDone ? "checked" : "unchecked"}
                                                                        aria-busy={inFlight}
                                                                        onClick={async () => {
                                                                            if (inFlight) return;
                                                                            // optimistic update
                                                                            setLocalProjects(prev => prev.map(p => {
                                                                                if (p._id !== project._id) return p;
                                                                                return {
                                                                                    ...p,
                                                                                    subtasks: p.subtasks.map((s: Subtask) => s.title === subtask.title ? { ...s, isDone: !s.isDone } : s)
                                                                                }
                                                                            }));
                                                                            setPendingToggles(prev => ({ ...prev, [toggleKey]: true }));
                                                                            try {
                                                                                await toggleSubtask({ taskId: project._id, subTaskName: subtask.title });
                                                                            } catch (err) {
                                                                                // rollback on error
                                                                                setLocalProjects(projectsQuery);
                                                                                console.error('toggleSubtask failed', err);
                                                                            } finally {
                                                                                setPendingToggles(prev => { const copy = { ...prev }; delete copy[toggleKey]; return copy; });
                                                                            }
                                                                        }}
                                                                    >

                                                                    </img>
                                                                    <div className='subtask-title'>{subtask.title}</div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <div className="task-footer">
                                                        <div className="footer-icons">
                                                            {/* comment icon */}
                                                            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                                <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>

                                                            {/* stopwatch / timer icon */}
                                                            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                                <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                        <div className="tag"># work</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        )
                    })}
                </section>
            </main>

            <aside className="calendar-pane">
                <div className="calendar-top">
                    <div className="cal-controls">
                        <div className="month">THU<br />9</div>
                    </div>
                </div>

                <div className="calendar-hours">
          // hours grid
                    <div className="hours-grid">
            // generate 24 hour rows visually via CSS
                    </div>
                </div>

                <div className="chat-btn">💬</div>
            </aside>
        </div>
    )
}