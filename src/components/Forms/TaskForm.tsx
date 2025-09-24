import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Spinner/Spinner";
import type { Subject } from "../Table/Subjects/Subject.type";
import { buildQueryParams } from "../../utils/queryParams";
import "./form.css";

// Schema with Zod

const taskSchema = z.object({
    subject_id: z.number().min(1, "Please select a subject"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    requirements: z.string().optional(),
    due_date: z
        .string()
        .min(1, "Due date is required")
        .refine((val) => new Date(val) > new Date(), {
            message: "Due date must be in the future",
        }),
    max_score: z
        .number()
        .min(1, "Max score must be greater than 0")
        .max(100, "Max score cannot exceed 100"),
});

export type TaskFormData = z.infer<typeof taskSchema>;


interface SubjectApiResponse {
    records: Subject[];
    message: string;
}

interface TaskFormProps {
    initialData?: Partial<TaskFormData>;
    onSubmit?: (data: TaskFormData) => Promise<void> | void;
    submitLabel?: string;
}


function TaskForm({
                      initialData,
                      onSubmit,
                      submitLabel = "Create Task",
                  }: TaskFormProps) {


    const page = 1;
    const pageSize = 20;
    const subjectUrl = `/api/admin/subjects/${buildQueryParams({
        page,
        page_size: pageSize,
    })}`;

    const fetchSubjects = async (): Promise<SubjectApiResponse> => {
        const token = import.meta.env.VITE_ADMIN_BEARER_TOKEN;
        const res = await fetch(subjectUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization : `Bearer ${token}`
            },

        });
        if (!res.ok) throw new Error("Failed to fetch subjects");
        return res.json();
    };

    const {
        data: subjectData,
        isLoading: subjectLoading,
        isError,
        error,
    } = useQuery<SubjectApiResponse>({
        queryKey: ["subjects", page, pageSize],
        queryFn: fetchSubjects,
    });

    const subjects = subjectData?.records ?? [];

    // -----------------------------
    // React Hook Form
    // -----------------------------
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            subject_id: initialData?.subject_id ?? 0,
            title: initialData?.title ?? "",
            description: initialData?.description ?? "",
            requirements: initialData?.requirements ?? "",
            due_date: initialData?.due_date ?? "",
            max_score: initialData?.max_score ?? 100,
        },
    });

    // Patch initial data into form
    useEffect(() => {
        if (initialData) {
            Object.entries(initialData).forEach(([key, value]) => {
                if (value !== undefined) {
                    setValue(key as keyof TaskFormData, value as any);
                }
            });
        }
    }, [initialData, setValue]);

    const submitHandler = async (data: TaskFormData) => {
        const payload = {
            ...data,
            due_date: new Date(data.due_date).toISOString(),
        };
        if (onSubmit) await onSubmit(payload);
    };

    if (subjectLoading) return <Spinner />;
    if (isError) return <p className="error">Error: {String(error)}</p>;



    return (
        <form onSubmit={handleSubmit(submitHandler)} className="formContainer">
            {/* Subject */}
            <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                    {...register("subject_id", { valueAsNumber: true })}
                    className="form-input"
                >
                    <option value="">-- Select a Subject --</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
                {errors.subject_id && <p className="error">{errors.subject_id.message}</p>}
            </div>

            {/* Title */}
            <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" {...register("title")} className="form-input" />
                {errors.title && <p className="error">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea {...register("description")} className="form-input" />
                {errors.description && (
                    <p className="error">{errors.description.message}</p>
                )}
            </div>

            {/* Requirements */}
            <div className="form-group">
                <label className="form-label">Requirements</label>
                <textarea {...register("requirements")} className="form-input" />
            </div>

            {/* Due Date */}
            <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                    type="datetime-local"
                    {...register("due_date")}
                    className="form-input"
                    min={new Date().toISOString().slice(0, 16)}
                />
                {errors.due_date && <p className="error">{errors.due_date.message}</p>}
            </div>

            {/* Max Score */}
            <div className="form-group">
                <label className="form-label">Max Score</label>
                <input
                    type="number"
                    {...register("max_score", { valueAsNumber: true })}
                    className="form-input"
                />
                {errors.max_score && <p className="error">{errors.max_score.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : submitLabel}
            </button>
        </form>
    );
}

export default TaskForm;
