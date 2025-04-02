/**
 * UserDashboard Component
 * 
 * Provides user management functionality including:
 * - Display list of all users
 * - Edit user information
 * - Delete users
 * - Role management
 * 
 * @component
 * @example
 * return (
 *   <UserDashboard />
 * )
 */
import React, { useState, useEffect } from 'react';
import { usuarioService } from '../../services/usuarioService';
import './UserDashboard.css';

const UserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    const [editForm, setEditForm] = useState({
        nombre: '',
        correo: '',
        rol: ''
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await usuarioService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditForm({
            nombre: user.nombre,
            correo: user.correo,
            rol: user.rol
        });
        setIsEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await usuarioService.updateUser(selectedUser.id, editForm);
            setIsEditing(false);
            loadUsers();
        } catch (err) {
            setError('Error updating user');
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await usuarioService.deleteUser(userId);
                loadUsers();
            } catch (err) {
                setError('Error deleting user');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    if (userRole !== 'superadmin') {
        return (
            <div className="user-profile">
                <div className="profile-container">
                    <div className="avatar">
                        
                        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Avatar" />
                    </div>
                    <div className="user-info">
                        <h2>¡Bienvenido, {userName}!</h2>
                        <div className="info-item">
                            <label>Correo:</label>
                            <span>{userEmail}</span>
                        </div>
                        <div className="info-item">
                            <label>Rol:</label>
                            <span>{userRole}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h2>User Management</h2>
            
            {isEditing ? (
                <div className="edit-form">
                    <h3>Edit User</h3>
                    <form onSubmit={handleUpdate}>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={editForm.nombre}
                                onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={editForm.correo}
                                onChange={(e) => setEditForm({...editForm, correo: e.target.value})}
                            />
                        </div>
                        <div>
                            <label>Role:</label>
                            <select
                                value={editForm.rol}
                                onChange={(e) => setEditForm({...editForm, rol: e.target.value})}
                            >
                                <option value="usuario">Usuario</option>
                                <option value="técnico">Técnico</option>
                                <option value="superadmin">Superadmin</option>
                            </select>
                        </div>
                        <div className="button-group">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.nombre}</td>
                                <td>{user.correo}</td>
                                <td>{user.rol}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)}>Edit</button>
                                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserDashboard;