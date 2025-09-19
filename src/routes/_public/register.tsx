import { createFileRoute } from '@tanstack/react-router'
import Register from "../../pages/auth/Register.tsx";

export const Route = createFileRoute('/_public/register')({
  component: RouterComponent
})

function RouterComponent() {
  return (
      <Register />
  )
}

