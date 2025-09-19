
export interface User {
    id: string;
    email: string;
    name: string;
    google_id: string;
    role: "trainee" | "admin" ;
    status:"approved" | "pending"  ;
    avatar_url: string;
    created_at: string;
    updated_at: string;
}