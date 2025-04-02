import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import './Register.css';
import { Link } from 'react-router-dom';

/**
 * Register Component
 * 
 * Handles new user registration with a form that collects:
 * - User name
 * - Email
 * - Password
 * - Role selection (usuario, técnico, superadmin)
 * Includes navigation to login page for existing users.
 * 
 * @component
 * @example
 * return (
 *   <Register />
 * )
 */
const Register = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        nombre: '',
        correo: '',
        contraseña: '',
        rol: 'usuario'
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await usuarioService.register(userData);
            navigate('/login');
        } catch (error) {
            // Display the specific error message
            setError(typeof error === 'string' ? error : 'Registration failed. Please try again.');
        }
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={userData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="correo"
                        value={userData.correo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="contraseña"
                        value={userData.contraseña}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role:</label>
                    <select name="rol" value={userData.rol} onChange={handleChange}>
                        <option value="usuario">Usuario</option>
                        <option value="técnico">Técnico</option>
                        <option value="superadmin">Superadmin</option>
                    </select>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="submit-btn">Register</button>
                
                <div className="auth-links">
                    <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Register;