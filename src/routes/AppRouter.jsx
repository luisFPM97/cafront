/**
 * AppRouter Component
 * 
 * Manages application routing with:
 * - Public routes (login, register)
 * - Protected routes (dashboard)
 * - Route protection based on authentication
 * - Default redirects
 * 
 * @component
 * @example
 * return (
 *   <AppRouter />
 * )
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import UserDashboard from '../components/dashboard/UserDashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                </Route>

                {/* Redirect to login if no route matches */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;