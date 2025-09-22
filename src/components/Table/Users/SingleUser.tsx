import type {User} from "./User.type.ts";
import {useFetch} from "../../../hooks/api/useFetch.tsx";
import {useMutate} from "../../../hooks/api/useMutate.tsx";
import React, {useEffect, useState} from "react";
import {useToast} from "../../../hooks/toast/useToast.tsx";
import Spinner from "../../Spinner/Spinner.tsx";
import "./userDetails.css"

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
        useMutate<SingleUserApiResponse, {role?: string; status?: string}>();
    const { mutate: deleteMutate, loading: deleteLoading, error: deleteError } = useMutate<any, null>();

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
                message: "Update successfully",
                autoClose: 500
            })
        } catch (error) {
            showToast({
                variant: 'error',
                message:"Error updating the details",
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
    if (loading) return<Spinner/>;
    if (error) return <p className="error">Error fetching user: {String(error)}</p>;

    if (!user) {
        return (
            <div className="not-found-error">
                No user found
            </div>
        )
    }


    return (
        <div className={"user-page"}>
            <div className="user-container">
                <h1 className="user-title">User Details</h1>

                <div className="card user-card">
                    <div className="card-img">
                        <img
                            src={user?.avatar_url}
                            alt={"Avatar"}
                        />
                    </div>
                    <div className="card-body">
                        <p><strong>Name:</strong> {user?.name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Current Role:</strong> {user?.role}</p>
                        <p><strong>Current Status:</strong> {user?.status}</p>
                    </div>

                </div>

                <hr className="divider" />

                <form onSubmit={handleUpdate} className="card form">
                    <h2 className="form-title">Edit User</h2>

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
        </div>

    );

}

export default SingleUser;

