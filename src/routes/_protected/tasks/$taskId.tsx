import { createFileRoute } from '@tanstack/react-router'
import SingleTask from "../../../components/Table/Tasks/SingleTask.tsx";

export const Route = createFileRoute('/_protected/tasks/$taskId')({
  component: RouteComponent,
})

function RouteComponent() {

    const {taskId} = Route.useParams();
    const tId = Number(atob(taskId));

  return (
    <SingleTask id={tId} />
  );
}
