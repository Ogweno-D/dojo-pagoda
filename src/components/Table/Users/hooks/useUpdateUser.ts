import type {User} from "../User.type.ts";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../../hooks/toast/useToast.tsx";
import {useNavigate} from "@tanstack/react-router";


interface UseUpdateUserProps{
    id:number;
}

interface SingleUserApiResponse{
    user: User;
    message:string;
}

// Fetch user
const fetchUser = async (id: number, token?: string): Promise<SingleUserApiResponse> => {
    const res = await fetch(`/api/admin/users/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
};

// Update user field
const updateUser = async ({id, field, value, token,}: {
    id: number;
    field: "role" | "status";
    value: string;
    token?: string;
}) => {
    const url = `/api/admin/users/${id}/${field}`;
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ [field]: value }),
    });
    if (!res.ok) throw new Error(`Failed to update ${field}`);
    return res.json();
};

// Delete user
const deleteUser = async (id: number, token?: string) => {
    const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return res.json();
};

export function useUpdateUser({ id }: UseUpdateUserProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const showToast = useToast();
    const token = import.meta.env.VITE_ADMIN_BEARER_TOKEN;

    // Form state
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");

    // Fetch user
    const { data, isLoading, isError, error, refetch } = useQuery<SingleUserApiResponse, Error>(
        { queryKey:["user", id], queryFn: () => fetchUser(id, token)}
    );

    const user = data?.user;

    // Initialize form state when user loads
    useEffect(() => {
        if (user) {
            setRole(user.role);
            setStatus(user.status);
        }
    }, [user]);

    // Mutations
    const updateMutation = useMutation(
        {
            mutationFn: updateUser,
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey:["users"]});
                refetch();
                showToast({
                    variant: "success",
                    message: "Updated successfully",
                    autoClose: 500});
            },
            onError: () => {
                showToast({
                    variant: "error",
                    message: "Update failed",
                    autoClose: 500});
                },

    });

    const deleteMutation = useMutation({
            mutationFn:deleteUser,
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey:["users"]})
                showToast({
                    variant: "success",
                    message: "Deleted successfully",
                    autoClose: 500
                });
            }
    });

    // Handlers
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (role !== user.role) {
            await updateMutation.mutateAsync({ id, field: "role", value: role, token });
        }
        if (status !== user.status) {
            await updateMutation.mutateAsync({ id, field: "status", value: status, token });
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete?")) {
            deleteMutation.mutate(id);
            navigate({
                to: '/users'
            })
        }
    };

    return {
        user,
        isLoading,
        isError,
        error,
        role,
        setRole,
        status,
        setStatus,
        handleUpdate,
        handleDelete,
    };
}
