import './homepage.css'
/*import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'*/
import { useRef, /*useState*/ useEffect } from 'react'

export function HomePage() {
    // utils/generateDays.ts
    function generateDays(center = new Date(), daysBefore = 30, daysAfter = 30) {
        const result: { id: string; name: string; date: string; fullDate: Date }[] = [];
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
    let todayIndex = 30; // weil wir 30 Tage vor und 30 Tage nach generieren
    const daysRef = useRef<HTMLDivElement | null>(null);
    //const [selectedDate, setSelectedDate] = useState(days[todayIndex].id);
    todayIndex = todayIndex - 1;


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
            behavior: "instant", // oder "smooth"
        });
    }, []);


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
                                <div className="note">2 tasks moved to archive</div>
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