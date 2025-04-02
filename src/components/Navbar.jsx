import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-brand">
                    <img className='logo' src="img/Recurso.png" alt="" />
                    ITControl Andes Export
                </div>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Inicio</Link>
                    <Link to="/dashboard" className="nav-link">Usuarios</Link>
                    <Link to="/activos" className="nav-link">Activos</Link>
                    <Link to="/mantenimientos" className="nav-link">Mantenimientos</Link>
                    <Link to="/incidencias" className="nav-link">Incidencias</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;