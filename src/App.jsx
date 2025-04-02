import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import './App.css';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/dashboard/UserDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import ActivosDashboard from './components/activos/ActivosDashboard';
import MantenimientosDashboard from './components/mantenimientos/MantenimientosDashboard';
import IncidenciasDashboard from './components/incidencias/IncidenciasDashboard';

function App() {
    return (
        <div className="app">
            <div className='maincont'>
                <Navbar/>
                <div className='separate'></div>
                <div className='routesCont'>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/activos" element={<ActivosDashboard />} />
                        <Route path="/mantenimientos" element={<MantenimientosDashboard />} />
                        <Route path="/incidencias" element={<IncidenciasDashboard />} />
                    </Route>

                    {/* Ruta raíz con redirección condicional */}
                    <Route 
                        path="/" 
                        element={
                            localStorage.getItem('userToken') 
                                ? <Navigate to="/dashboard" /> 
                                : <Navigate to="/login" />
                        } 
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;
