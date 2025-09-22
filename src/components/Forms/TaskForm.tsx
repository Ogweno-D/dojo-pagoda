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
    onSubmit?: (data: TaskFormData) => Promise<void> | void;
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

    const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

    // Initialize formData once
    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                ...initialData,
            }));
        }
    }, []); // run only once on mount

    // Fetch subjects
    const subjectUrl = `/api/admin/subjects/${buildQueryParams({
        page,
        page_size: pageSize,
    })}`;
    const fetchOptions = { headers: { "Content-Type": "application/json" } };
    const { data, loading: subjectLoading } = useFetch<SubjectApiResponse>(subjectUrl, fetchOptions);
    const subjects: Subject[] = data?.records ?? [];

    // Validation helper
    const validateField = (field: keyof TaskFormData, value: any): string => {
        switch (field) {
            case "subject_id":
                return value ? "" : "Please select a subject.";
            case "title":
                return value.trim() ? "" : "Title is required.";
            case "description":
                return value.trim() ? "" : "Description is required.";
            case "due_date":
                if (!value) return "Due date is required.";
                if (new Date(value) <= new Date()) return "Due date must be in the future.";
                return "";
            case "max_score":
                if (value <= 0) return "Max score must be greater than 0.";
                if (value > 100) return "Max score cannot exceed 100.";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const key = name as keyof TaskFormData;

        setFormData((prev) => ({
            ...prev,
            [key]: key === "subject_id" || key === "max_score" ? Number(value) : value,
        }));

        // Validate this field
        setErrors((prev) => ({
            ...prev,
            [key]: validateField(key, value),
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
        (Object.keys(formData) as (keyof TaskFormData)[]).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload: TaskFormData = {
            ...formData,
            due_date: formData.due_date ? new Date(formData.due_date).toISOString() : "",
        };

        if (onSubmit) await onSubmit(payload);
    };

    if (subjectLoading) return <Spinner />;

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
                {errors.subject_id && <p className="error">{errors.subject_id}</p>}
            </div>

            <div className="form-group">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
                {errors.title && <p className="error">{errors.title}</p>}
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
                {errors.description && <p className="error">{errors.description}</p>}
            </div>

            <div className="form-group">
                <label className="form-label">Requirements</label>
                <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                    type="datetime-local"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                    min={new Date().toISOString().slice(0, 16)}

                />
                {errors.due_date && <p className="error">{errors.due_date}</p>}
            </div>

            <div className="form-group">
                <label className="form-label">Max Score</label>
                <input
                    type="number"
                    name="max_score"
                    value={formData.max_score}
                    onChange={handleChange}
                    className="form-input"
                />
                {errors.max_score && <p className="error">{errors.max_score}</p>}
            </div>

            <button type="submit" className="btn btn-primary">
                {submitLabel}
            </button>
        </form>
    );
}

export default TaskForm;
