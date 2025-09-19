import { createFileRoute } from '@tanstack/react-router'
import Login from "../../pages/auth/Login.tsx";

export const Route = createFileRoute('/_public/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div> <Login/> </div>
}
