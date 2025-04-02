/**
 * ProtectedRoute Component
 * 
 * Higher-order component that:
 * - Protects routes requiring authentication
 * - Checks for valid user token
 * - Redirects to login if unauthorized
 * 
 * @component
 * @example
 * return (
 *   <ProtectedRoute>
 *     <ProtectedComponent />
 *   </ProtectedRoute>
 * )
 */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem('userToken');

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;