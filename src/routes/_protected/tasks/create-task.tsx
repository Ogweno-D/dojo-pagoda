import { createFileRoute } from '@tanstack/react-router'
import TaskForm from "../../../components/Forms/TaskForm.tsx";

export const Route = createFileRoute('/_protected/tasks/create-task')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <div className={"task-form"}>
        <h1 style={{
          fonSize: "2rem",
          textAlign: "start",
          margin: "12px",
        }}> Create a Task</h1>
        <TaskForm/>
      </div>
  );
}
