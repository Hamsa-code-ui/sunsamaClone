import './homepage.css'
import { useRef } from 'react'

export function HomePage() {
    const days = [
        { name: 'Thursday', date: 'October 9' },
        { name: 'Friday', date: 'October 10' },
        { name: 'Saturday', date: 'October 11' },
        { name: 'Sunday', date: 'October 12' },
        { name: 'Monday', date: 'October 13' },
        { name: 'Tuesday', date: 'October 14' },
        { name: 'Wednesday', date: 'October 15' },
        { name: 'Thursday', date: 'October 16' },
        { name: 'Friday', date: 'October 17' },
        { name: 'Saturday', date: 'October 18' },
    ]

    const daysRef = useRef<HTMLDivElement | null>(null)

    function handleWheel(e: React.WheelEvent) {
        const el = daysRef.current
        if (!el) return

        // If the wheel movement is primarily vertical, scroll horizontally.
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            el.scrollLeft += e.deltaY
            e.preventDefault()
        }
    }

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