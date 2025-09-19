import { Card } from "./Card.tsx";
import "./dashboard.css";

function Dashboard(){
    const stats = [
        { title: "Total Users", value: 120, change: "+12%" },
        { title: "Active Subjects", value: 35, change: "+3%" },
        { title: "Total Tasks", value: 220, change: "+8%" },
        { title: "Completed Tasks", value: 150, change: "+15%" },
    ];

    const activities = [
        { type: "blue", title: "New user registered", desc: "David Brown joined 2 hours ago" },
        { type: "green", title: "Task completed", desc: "Landing page mockups finished" },
        { type: "purple", title: "New subject created", desc: "Data Analysis subject added" },
    ];

    const taskStats = [
        { name: "Pending", value: 40 },
        { name: "In Progress", value: 30 },
        { name: "Completed", value: 150 },
        { name: "Cancelled", value: 5 },
    ];

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Manage users, subjects, and tasks from your central control panel</p>
            </header>

            {/* Stats cards */}
            <section className="dashboard-grid">
                {stats.map((stat) => (
                    <Card
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        change={stat.change}
                    />
                ))}
            </section>

            {/* Extra sections */}
            <section className="dashboard-sections">
                {/* Recent Activity */}
                <div className="card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                        <p className="card-subtitle">Latest user and task updates</p>
                    </div>
                    <div className="card-content space-y">
                        {activities.map((a, i) => (
                            <div key={i} className="activity-item">
                                <span className={`dot dot-${a.type}`} />
                                <div className="activity-text">
                                    <p className="activity-title">{a.title}</p>
                                    <p className="activity-desc">{a.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Task Status Overview */}
                <div className="card">
                    <div className="card-header">
                        <h3>Task Status Overview</h3>
                        <p className="card-subtitle">Current task distribution</p>
                    </div>
                    <div className="card-content space-y">
                        {taskStats.map((t) => (
                            <div key={t.name} className="task-item">
                                <span>{t.name}</span>
                                <span className="task-value">{t.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export  default Dashboard;
