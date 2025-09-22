import { Card } from "./Card.tsx";
import "./dashboard.css";
import type {User} from "../Table/Users/User.type.ts";
import { useFetch } from "../../hooks/api/useFetch.tsx";
import type {UserApiResponse} from "../../routes/_protected/users";
import type {SubjectApiResponse} from "../../routes/_protected/subjects";
import type {Subject} from "../Table/Subjects/Subject.type.ts";
import type {TaskApiResponse} from "../../routes/_protected/tasks";
import type {Task} from "../Table/Tasks/Task.type.ts";

function Dashboard(){

    const {data} = useFetch<UserApiResponse>(   `api/admin/users/?page=1&pageSize=20`, {
        headers: {"Content-Type": "application/json"}
    });
    const users: User[] = data?.records ?? [];

    const {data:subjectData} = useFetch<SubjectApiResponse>(   `api/admin/subjects/?page=1&pageSize=20`, {
        headers: {"Content-Type": "application/json"}
    });
    const subjects: Subject[] = subjectData?.records ?? [];

    const {data:taskData} = useFetch<TaskApiResponse>(   `api/admin/tasks`, {
        headers: {"Content-Type": "application/json"}
    });
    const tasks: Task[] = taskData?.records ?? [];

    // Computations
    const totalUsers = users.length;

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const activeSubjects = subjects.filter((s) => new Date(s.created_at) >= twoWeeksAgo).length;

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((t) => t.is_active).length;


    const stats = [
        { title: "Total Users", value: totalUsers, change: "+12%" },
        { title: "Active Subjects", value: activeSubjects, change: "+3%" },
        { title: "Total Tasks", value: totalTasks, change: "+8%" },
        { title: "Completed Tasks", value: completedTasks, change: "+15%" },
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
}

export  default Dashboard;
