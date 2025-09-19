import { createFileRoute } from '@tanstack/react-router'
import ForgotPassword from "../../pages/auth/ForgotPassword.tsx";

export const Route = createFileRoute('/_public/forgot-password')({
    component: RouterComponent
})

function RouterComponent() {
    return (
        <ForgotPassword />
    )
}