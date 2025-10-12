import './homepage.css'

export function HomePage() {
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

                <section className="days">
                    <div className="day-col">
                        <div className="day-head">
                            <div className="day-name">Thursday</div>
                            <div className="day-date">October 9</div>
                        </div>
                        <div className="add-task">+ Add task</div>
                        <div className="note">2 tasks moved to archive</div>
                    </div>

                    <div className="day-col">
                        <div className="day-head">
                            <div className="day-name">Friday</div>
                            <div className="day-date">October 10</div>
                        </div>
                        <div className="add-task small">+</div>
                    </div>

                    <div className="day-col">
                        <div className="day-head">
                            <div className="day-name">Saturday</div>
                            <div className="day-date">October 11</div>
                        </div>
                        <div className="add-task small">+</div>
                    </div>
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