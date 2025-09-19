// TaskForm.tsx
import { buildQueryParams } from "../../utils/queryParams.ts";
import { useFetch } from "../../hooks/api/useFetch.tsx";
import type { Subject } from "../Table/Subjects/Subject.type.ts";
import React, { useEffect, useState } from "react";
import "./form.css";
import Spinner from "../Spinner/Spinner.tsx";

export interface TaskFormData {
    subject_id: number;
    title: string;
    description: string;
    requirements: string;
    due_date: string;
    max_score: number;
}

interface TaskFormProps {
    initialData?: Partial<TaskFormData>;
    onSubmit: (data: TaskFormData) => Promise<void> | void;
    submitLabel?: string;
}

interface SubjectApiResponse {
    records: Subject[];
    message: string;
}

function TaskForm({ initialData, onSubmit, submitLabel = "Create Task" }: TaskFormProps) {
    const [page] = useState(1);
    const [pageSize] = useState(10);

    const [formData, setFormData] = useState<TaskFormData>({
        subject_id: initialData?.subject_id ?? 0,
        title: "",
        description: "",
        requirements: "",
        due_date: "",
        max_score: 100,
    });

    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                ...initialData,
            }));
        }
    }, [initialData]);

    // Fetch subjects
    const subjectUrl = `/api/admin/subjects/${buildQueryParams({
        page,
        page_size: pageSize,
    })}`;
    const fetchOptions = { headers: { "Content-Type": "application/json" } };
    const { data, loading: subjectLoading } = useFetch<SubjectApiResponse>(subjectUrl, fetchOptions);
    const subjects: Subject[] = data?.records ?? [];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "subject_id" || name === "max_score" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.subject_id) {
            alert("Please select a subject before submitting.");
            return;
        }

        const payload: TaskFormData = {
            ...formData,
            due_date: formData.due_date
                ? new Date(formData.due_date).toISOString()
                : "",
        };

        await onSubmit(payload);
    };

    if (subjectLoading) {
        return <Spinner />;
    }

    return (
        <form onSubmit={handleSubmit} className="formContainer">
            <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                    name="subject_id"
                    value={formData.subject_id || ""}
                    onChange={handleChange}
                    className="form-input"
                    required
                >
                    <option value="">-- Select a Subject --</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Requirements</label>
                <textarea
                    name="requirements"
                    value={formData.requirements || ""}
                    onChange={handleChange}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                    type="datetime-local"
                    name="due_date"
                    value={formData.due_date || ""}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Max Score</label>
                <input
                    type="number"
                    name="max_score"
                    value={formData.max_score || 100}
                    onChange={handleChange}
                    className="form-input"
                />
            </div>

            <button type="submit" className="btn btn-primary">
                {submitLabel}
            </button>
        </form>
    );
}

export default TaskForm;
