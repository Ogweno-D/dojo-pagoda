import { createFileRoute } from '@tanstack/react-router'
import Settings from "../../components/Settings/Settings.tsx";

export const Route = createFileRoute('/_protected/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <Settings/>
  )
}
