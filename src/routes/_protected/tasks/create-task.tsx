import { createFileRoute } from '@tanstack/react-router'
import TaskForm from "../../../components/Forms/TaskForm.tsx";

export const Route = createFileRoute('/_protected/tasks/create-task')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <TaskForm/>
  );
}
