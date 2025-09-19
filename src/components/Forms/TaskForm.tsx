import {buildQueryParams} from "../../utils/queryParams.ts";
import {useFetch} from "../../hooks/api/useFetch.tsx";
import type {Subject} from "../Table/Subjects/Subject.type.ts";
import {useNavigate} from "@tanstack/react-router";
import React, {useState} from "react";
import {useMutate} from "../../hooks/api/useMutate.tsx";

interface TaskFormProps {
    subject_id: number;
    title: string;
    description: string;
    requirements: string;
    due_date: string;
    max_score: number;
}

function TaskForm() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [formData, setFormData] = useState<Partial<Task>>({
        subject_id: undefined,
        title: "",
        description: "",
        requirements: "",
        due_date: "",
        max_score: 100,
    });

    // Fetch the subjects
    const params = {
        page,
        page_size: pageSize,
    };

    const subjectUrl = `/api/admin/subjects/${buildQueryParams(params)}`;

    const taskUrl = `/api/admin/tasks/`;

    const fetchOptions = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };

    const { data, loading, error } = useFetch<SubjectApiResponse>(
        subjectUrl,
        fetchOptions
    );
    const subjects: Subject[] = data?.records ?? [];

    const { mutate: mutateTask, loading: updateLoading, error: updateError} = useMutate<TaskFormProps, {formData}>()

    //
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "subject_id" || name === "max_score"
                    ? Number(value)
                    : value,
        }));

    }

    const handleSubmit = async ( e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.subject_id) {
            alert("Please select a subject before submitting.");
            return;
        }

        const payload = {
            ...formData,
            due_date: formData.due_date
                ? new Date(formData.due_date).toISOString() // ensures 2025-07-24T02:07:03.794Z format
                : undefined,
        };

        try {
            await mutateTask(
                taskUrl, "POST", payload, fetchOptions);
        } catch (err) {
            console.error("Failed to submit task:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={"formContainer"}>
            <div className={"form-group"}>
                <label className={"form-label"}>Subject</label>
                <select
                    name="subject_id"
                    value={formData.subject_id || ""}
                    onChange={handleChange}
                    className={"form-input"}
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

            <div className={"form-group"}>
                <label className={"form-label"}>Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    className={"form-input"}
                    required
                />
            </div>

            <div className={"form-group"}>
                <label className={"form-label"}>Description</label>
                <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    className={"form-input"}
                    required
                />
            </div>

            <div className={"form-group"}>
                <label className={"form-label"}>Requirements</label>
                <textarea
                    name="requirements"
                    value={formData.requirements || ""}
                    onChange={handleChange}
                    className={"form-input"}
                />
            </div>

            <div className={"form-group"}>
                <label className={"form-label"}>Due Date</label>
                <input
                    type="datetime-local"
                    name="due_date"
                    value={formData.due_date || ""}
                    onChange={handleChange}
                    className={"form-input"}
                    required
                />
            </div>

            <div className={"form-group"}>
                <label className={"form-label"}>Max Score</label>
                <input
                    type="number"
                    name="max_score"
                    value={formData.max_score || 100}
                    onChange={handleChange}
                    className={"form-input"}
                />
            </div>

            <button
                type="submit"
                className={"form-btn"}
                disabled={loading}
            >
                {loading ? "Submitting..." : "Create Task"}
            </button>

            {error && <p className={"form-error"}>{String(error)}</p>}
            {/*{data && <p className={"form-success"}>Task created successfully!</p>}*/}
        </form>
    );
}

export default TaskForm;