import api from './api';

export const mantenimientoService = {
    getMantenimientos: async (activoId) => {
        console.log(activoId)
        const response = await api.get(`/mantenimientos?activoId=${activoId}`);
        return response.data;
        
    },

    createMantenimiento: async (mantenimientoData) => {
        // Asegurarse de que las fechas estén en el formato correcto
        console.log(mantenimientoData)
        const formattedData = {
            ...mantenimientoData,
            fechaInicio: new Date(mantenimientoData.fechaInicio).toISOString(),
            fechaFin: mantenimientoData.fechaFin ? new Date(mantenimientoData.fechaFin).toISOString() : null,
            activoId: parseInt(mantenimientoData.activoId)
        };
        
        const response = await api.post('/mantenimientos', formattedData);
        return response.data;
    },

    updateMantenimiento: async (id, mantenimientoData) => {
        const formattedData = {
            ...mantenimientoData,
            fechaInicio: new Date(mantenimientoData.fechaInicio).toISOString(),
            fechaFin: mantenimientoData.fechaFin ? new Date(mantenimientoData.fechaFin).toISOString() : null,
            activoId: parseInt(mantenimientoData.activoId)
        };
        
        const response = await api.put(`/mantenimientos/${id}`, formattedData);
        return response.data;
    },

    deleteMantenimiento: async (id) => {
        const response = await api.delete(`/mantenimientos/${id}`);
        return response.data;
    }
};