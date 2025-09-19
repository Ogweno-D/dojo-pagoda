import { createFileRoute } from '@tanstack/react-router'
import SubjectTable from "../../../components/Table/Subjects/SubjectsTable/SubjectTable.tsx";

export const Route = createFileRoute('/_protected/subjects/')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
      <div>
          <SubjectTable/>
      </div>
  )
}
