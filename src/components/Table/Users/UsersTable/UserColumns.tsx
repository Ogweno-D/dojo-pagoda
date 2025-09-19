import { createTableColumn } from '../../ReusableTable/TableColumn.ts';
import type {User} from '../User.type.ts';
import {useNavigate} from "@tanstack/react-router";


export function  useUserColumns() {
     const navigate = useNavigate();

    return [
        createTableColumn<User>({
            id: "id",
            caption: "ID",
            size: 80,
            onClick: (id) => {
                const encodedId = btoa(id);

                navigate({
                    to: "/users/$userId",
                    params: {userId: encodedId}
                })

            },
        }),
        createTableColumn<User>({
            id: "avatar_url",
            caption: "Avatar",
            render: (url) => <img src={url} alt="User Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />,
        }),
        createTableColumn<User>({
            id: "name",
            caption: "Name",
            render: (name) => <strong style={{ textDecoration: 'underline' }}>{name}</strong>,
            rowProps: (user) => {
                let backgroundColor = 'transparent';
                if (user.status === 'approved') {
                    backgroundColor = '#fca5a5';
                } else if (user.status === 'approved') {
                    backgroundColor = '#bfdbfe';
                }
                return {
                    style: { backgroundColor },
                };
            },
        }),
        createTableColumn<User>({
            id: "email",
            caption: "Email",
        }),
        createTableColumn<User>({
            id: "role",
            caption: "Role",
            render: (role) => (
                <span style={{
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    backgroundColor: role === 'admin' ? 'lightblue' : 'lightgray',
                }}>
                {role}
            </span>
            ),
        }),
        createTableColumn<User>({
            id: "status",
            caption: "Status",
            rowProps: (user) => ({
                className: user.status === 'pending' ? '' : '',
            }),
        }),
        createTableColumn<User>({
            id: "created_at",
            caption: "Created At",
            render: (createdAt) => new Date(createdAt).toLocaleDateString(),
        }),
        createTableColumn<User>({
            id: "updated_at",
            caption: "Last Updated",
            hide: true,
        }),

        //Generic Actions
        // createTableColumn<User>({
        //     id: 'actions',
        //     caption: 'Actions',
        //     render: (cellData, rowData) => (
        //         <>
        //             <button onClick={() => alert(`Editing user: ${rowData.name}`)}>
        //                 Edit
        //             </button>
        //             <button onClick={() => alert(`Deleting user: ${rowData.name}`)}>
        //                 Delete
        //             </button>
        //         </>
        //     ),
        // }),
    ];
}
