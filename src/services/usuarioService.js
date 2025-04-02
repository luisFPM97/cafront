/**
 * User Service
 * 
 * Handles all user-related API calls:
 * - User registration
 * - User authentication
 * - User management (CRUD operations)
 * - Error handling for user operations
 * 
 * @module
 */
import api from './api';

export const usuarioService = {
    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/usuarios/login', credentials);
            // Store token if your backend returns one
            if (response.data.token) {
                localStorage.setItem('userToken', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post('/usuarios', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all users
    getAllUsers: async () => {
        try {
            const response = await api.get('/usuarios');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get user by ID
    getUser: async (id) => {
        try {
            const response = await api.get(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update user
    updateUser: async (id, userData) => {
        try {
            const response = await api.put(`/usuarios/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete user
    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};