import { createFileRoute } from '@tanstack/react-router'
import TaskTable from "../../../components/Table/Tasks/TasksTable/TaskTable.tsx";

export const Route = createFileRoute('/_protected/tasks/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TaskTable/>
  );
}
