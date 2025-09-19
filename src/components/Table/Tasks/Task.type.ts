export interface Task  {
    id: number;
    subject_id: number;
    title: string;
    description: string;
    requirements: string;
    due_date: string;
    max_score: number;
    is_active: boolean;
    created_by: number;
    created_at: string;
    updated_at: string;
    created_by_name: string;
    subject_name: string;
}