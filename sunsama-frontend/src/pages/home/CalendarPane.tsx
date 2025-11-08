import './homepage.css'

export default function CalendarPane() {
    return (
        <aside className="calendar-pane">
            <div className="calendar-top">
                <div className="cal-controls">
                    <div className="month">THU<br />9</div>
                </div>
            </div>

            <div className="calendar-hours">
                {/* hours grid */}
                <div className="hours-grid">
                    {/* visual rows via CSS */}
                </div>
            </div>

            <div className="chat-btn">💬</div>
        </aside>
    )
}
