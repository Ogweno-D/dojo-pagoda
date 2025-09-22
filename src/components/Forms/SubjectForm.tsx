    import React, { useEffect, useState } from "react";
    import type {Subject} from "../Table/Subjects/Subject.type.ts";

    interface SubjectFormProps {
        initialData?: Partial<Subject>;
        onSubmit: (data: { name: string; description: string }) => Promise<void> | void;
        submitLabel?: string;
    }

    function SubjectForm({
                             initialData,
                             onSubmit,
                             submitLabel = "Create Subject",
                         }: SubjectFormProps) {
        const [formData, setFormData] = useState<{ name: string; description: string }>({
            name: "",
            description: "",
        });

        useEffect(() => {
            if (initialData) {
                setFormData((prev) => ({
                    ...prev,
                    ...initialData,
                }));
            }
        }, [initialData]);

        const handleChange = (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            await onSubmit(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="formContainer">
                <div className="form-group">
                    <label className="form-label">Subject Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
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
                </div>

                <button type="submit" className="btn btn-primary">
                    {submitLabel}

                </button>
            </form>
        );
    }

    export default SubjectForm;
