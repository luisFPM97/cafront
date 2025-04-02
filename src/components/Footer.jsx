/**
 * Footer Component
 * 
 * Displays a fixed footer at the bottom of the page containing:
 * - Current date and time (updates every second)
 * - Logout button
 * 
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const userName = localStorage.getItem('userName') || 'Usuario';

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.clear(); // Limpia todos los datos almacenados
        window.location.href = '/login';
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="user-info">
                    Bienvenido, {userName}
                </div>
                <div className="datetime">
                    {currentDateTime.toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>
        </footer>
    );
};

export default Footer;