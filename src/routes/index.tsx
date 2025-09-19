import { createFileRoute } from '@tanstack/react-router'
import Homepage from "../components/Home/Homepage.tsx";

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <Homepage/>
  )
}
