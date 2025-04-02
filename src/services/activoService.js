import api from './api';

export const activoService = {
    getAllActivos: async () => {
        const response = await api.get('/activos');
        return response.data;
    },

    createActivo: async (activoData) => {
        const response = await api.post('/activos', activoData);
        return response.data;
    },

    updateActivo: async (id, activoData) => {
        const response = await api.put(`/activos/${id}`, activoData);
        return response.data;
    },

    deleteActivo: async (id) => {
        const response = await api.delete(`/activos/${id}`);
        return response.data;
    }
};