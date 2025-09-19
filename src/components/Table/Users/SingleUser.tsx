    import type {User} from "./User.type.ts";
import {useFetch} from "../../../hooks/api/useFetch.tsx";
import {useMutate} from "../../../hooks/api/useMutate.tsx";
import React, {useEffect, useState} from "react";
import {useToast} from "../../../hooks/toast/useToast.tsx";

interface  SingleUserProps{
    id: number;
}
interface SingleUserApiResponse {
    user: User;
    message: string
}


function SingleUser({id}: SingleUserProps) {
    // hooks
    const showToast = useToast();

    const url = `/api/admin/users/${id}`;

    const updateStatusUrl = `/api/admin/users/${id}/status`;
    const updateRoleUrl = `/api/admin/users/${id}/role`;

    const fetchOptions = {
        headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    }
    const {data, loading, error, refetch} = useFetch<SingleUserApiResponse>(
        url,
        fetchOptions
    )
    const user: User | undefined= data?.user
    if (error) {
        return <p className="error">Error: {String(error)}</p>;
    }


    //  Mutation hooks for the updating and deleting
    const {mutate: updateMutate, loading: updateLoading, error: updateError } =
        useMutate<SingleUserApiResponse, {role: string; status: string}>();
    const { mutate: deleteMutate, loading: deleteLoading, error: deleteError } = useMutate<any, null>(url);

    // Updating the form inputs
    const [role, setRole] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    // Initialize form state when the user data is loaded
    useEffect(() => {
        if(user){
            setRole(user.role);
            setStatus(user.status);
        }
    }, [user]);

    //Handle  the user update
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if(updateLoading) return;
        try {
            // update role if it's changed
            if (role && role !== user?.role) {
                await updateMutate(updateRoleUrl, "PUT", { role }, fetchOptions);
            }

            // update status if it's changed
            if (status && status !== user?.status) {
                await updateMutate(updateStatusUrl, "PUT", { status }, fetchOptions);
            }

            await refetch();

            showToast({
                variant: "success",
                title: "Update successfully",
                autoClose: 500
            })
        } catch (error) {
            showToast({
                variant: 'error',
                title:"Error updating the details",
                autoClose: 500
            })
        }
    }

    const handleDelete = async () => {
        if(window.confirm("Are you sure you want to delete?")){
            try {
                await deleteMutate(
                    url,
                    "DELETE" , null, fetchOptions );
                showToast({
                    variant: "success",
                    message: "Delete successfully",
                    autoClose: 500
                })
                window.location.href = '/users'
            } catch (error) {
                showToast({
                    variant: "error",
                    message: "Delete failed",
                    autoClose: 500
                })
            }
        }
    }

    //
    if (loading) return <p>Loading user data...</p>;
    if (error) return <p className="error">Error fetching user: {String(userError)}</p>;
    if (!user) return <p>No user found for this ID.</p>;


    return (
        <div className="user-container">
            <h1 className="user-title">User Details</h1>

            <div className="card">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Current Role:</strong> {user?.role}</p>
                <p><strong>Current Status:</strong> {user?.status}</p>
            </div>

            <hr className="divider" />

            <form onSubmit={handleUpdate} className="card form">
                <h2 className="form-title">Update User</h2>

                <div className="form-group">
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="trainee">Trainee</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={updateLoading}
                    >
                        {updateLoading ? "Updating..." : "Update User"}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="btn btn-danger"
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? "Deleting..." : "Delete User"}
                    </button>
                </div>
            </form>

            {updateError && <p className="error-text"> Update failed: {String(updateError)}</p>}
            {deleteError && <p className="error-text">Delete failed: {String(deleteError)}</p>}
        </div>
    );

}

export default SingleUser;

