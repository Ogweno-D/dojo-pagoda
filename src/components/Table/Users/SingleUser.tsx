import Spinner from "../../Spinner/Spinner.tsx";
import { useUpdateUser } from "./hooks/useUpdateUser.ts";
import "./userDetails.css";

interface SingleUserProps {
    id: number;
}

function SingleUser({ id }: SingleUserProps) {
    const {
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
    } = useUpdateUser({ id });

    if (isLoading) return <Spinner />;
    if (isError) return <p className="error">Error: {String(error)}</p>;
    if (!user) return <div className="not-found-error">No user found</div>;

    return (
        <div className="user-page">
            <div className="user-container">
                <h1 className="user-title">User Details</h1>

                <div className="card user-card">
                    <div className="card-img">
                        <img src={user.avatar_url} alt="Avatar" />
                    </div>
                    <div className="card-body">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Current Role:</strong> {user.role}</p>
                        <p><strong>Current Status:</strong> {user.status}</p>
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
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update User"}
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SingleUser;