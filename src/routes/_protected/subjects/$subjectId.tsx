    import { createFileRoute } from '@tanstack/react-router'
    import SingleSubject from "../../../components/Table/Subjects/SingleSubject.tsx";

    export const Route = createFileRoute('/_protected/subjects/$subjectId')({
      component: RouteComponent,
    })

    function RouteComponent() {
        const {subjectId} = Route.useParams();
        const suid = Number(atob(subjectId));
        return (
            <div>
                <SingleSubject subjectId={suid}  />
            </div>
        )
    }
