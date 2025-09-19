import { createFileRoute } from '@tanstack/react-router'
import UserTable from "../../../components/Table/Users/UsersTable/UserTable.tsx";

export const Route = createFileRoute('/_protected/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <UserTable />
  )
}
