import { useEffect } from "react";
import type { Subject } from "../Table/Subjects/Subject.type.ts";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const subjectSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    description: z.string().min(1, "Description is required"),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
    initialData?: Partial<Subject>;
    onSubmit: (data: SubjectFormData) => Promise<void> | void;
    submitLabel?: string;
}

function SubjectForm({
                         initialData,
                         onSubmit,
                         submitLabel = "Create Subject",
                     }: SubjectFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SubjectFormData>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                description: initialData.description || "",
            });
        }
    }, [initialData, reset]);

    const submitHandler = async (data: SubjectFormData) => {
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="formContainer">
            <div className="form-group">
                <label htmlFor="name" className="form-label">Subject Name</label>
                <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="form-input"
                />
                {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                    id="description"
                    {...register("description")}
                    className="form-input"
                />
                {errors.description && (
                    <p className="error-text">{errors.description.message}</p>
                )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}

export default SubjectForm;