import api from './api';

export const incidenciaService = {
    getAllIncidencias: async () => {
        const response = await api.get('/incidencias');
        return response.data;
    },

    createIncidencia: async (incidenciaData) => {
        const formattedData = {
            ...incidenciaData,
            fechaSolicitud: new Date().toISOString(),
            fechaFinalizacion: incidenciaData.fechaFinalizacion ? new Date(incidenciaData.fechaFinalizacion).toISOString() : null,
            usuarioSolicitanteId: parseInt(incidenciaData.usuarioSolicitanteId),
            usuarioAsignadoId: incidenciaData.usuarioAsignadoId ? parseInt(incidenciaData.usuarioAsignadoId) : null,
            activoId: parseInt(incidenciaData.activoId)
        };
        
        const response = await api.post('/incidencias', formattedData);
        return response.data;
    },

    updateIncidencia: async (id, incidenciaData) => {
        const formattedData = {
            ...incidenciaData,
            fechaFinalizacion: incidenciaData.estado === 'terminado' ? new Date().toISOString() : null,
            usuarioAsignadoId: incidenciaData.usuarioAsignadoId ? parseInt(incidenciaData.usuarioAsignadoId) : null
        };
        
        const response = await api.put(`/incidencias/${id}`, formattedData);
        return response.data;
    },

    deleteIncidencia: async (id) => {
        const response = await api.delete(`/incidencias/${id}`);
        return response.data;
    }
};