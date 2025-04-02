import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import './Login.css'
import { Link } from 'react-router-dom';

/**
 * Login Component
 * 
 * Handles user authentication through a login form.
 * Allows users to input their email and password to access the system.
 * Includes navigation to registration page for new users.
 * 
 * @component
 * @example
 * return (
 *   <Login />
 * )
 */
const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        correo: '',
        contraseña: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await usuarioService.login(credentials);
            localStorage.setItem('userToken', response.token);
            // Guardar datos del usuario
            localStorage.setItem('userName', response.usuario.nombre);
            localStorage.setItem('userEmail', response.usuario.correo);
            localStorage.setItem('userRole', response.usuario.rol);
            navigate('/dashboard');
        } catch (error) {
            setError(typeof error === 'string' ? error : 'Login failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="correo"
                        value={credentials.correo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="contraseña"
                        value={credentials.contraseña}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit" className="submit-btn">Login</button>
                
                <div className="auth-links">
                    <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;