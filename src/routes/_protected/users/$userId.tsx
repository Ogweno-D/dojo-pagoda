import { createFileRoute } from '@tanstack/react-router'
import SingleUser from "../../../components/Table/Users/SingleUser.tsx";

export const Route = createFileRoute('/_protected/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
    const {userId} = Route.useParams();
    const uid = atob(userId);
  return (
      <div>
          <SingleUser id={uid}  />
      </div>
  )
}
