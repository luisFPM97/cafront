import React, { useState, useEffect } from 'react';
import { mantenimientoService } from '../../services/mantenimientoService';
import { activoService } from '../../services/activoService';
import './MantenimientosDashboard.css';

const MantenimientosDashboard = () => {
    const [mantenimientos, setMantenimientos] = useState([]);
    const [activos, setActivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
    const [selectedActivoId, setSelectedActivoId] = useState(1);

    const [formData, setFormData] = useState({
        descripcion: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: '',
        activoId: ''
    });

    useEffect(() => {
        loadActivos();
    }, []);

    useEffect(() => {
        if (selectedActivoId) {
            loadMantenimientos(selectedActivoId);
            console.log(selectedActivoId)
        }
    }, [selectedActivoId]);

    const loadActivos = async () => {
        try {
            const data = await activoService.getAllActivos();
            setActivos(data);
            if (data.length > 0) {
                setSelectedActivoId(data[0].id);
            }
        } catch (err) {
            setError('Error cargando activos');
        }
    };

    const loadMantenimientos = async (activoId) => {
        try {
            setLoading(true);
            const data = await mantenimientoService.getMantenimientos(activoId);
            setMantenimientos(data);
            console.log(activoId)
        } catch (err) {
            setError('Error cargando mantenimientos');
            console.log(activoId)
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const mantenimientoData = {
                descripcion: formData.descripcion,
                fechaInicio: formData.fechaInicio,
                fechaFin: formData.fechaFin || null,
                activoId: parseInt(selectedActivoId)
                
            };

            if (isEditing) {
                await mantenimientoService.updateMantenimiento(selectedMantenimiento.id, mantenimientoData);
            } else {
                await mantenimientoService.createMantenimiento(mantenimientoData);
                console.log(mantenimientoData.activoId)
            }
            loadMantenimientos(selectedActivoId);
            resetForm();
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Error al guardar el mantenimiento');
        }
    };

    const handleEdit = (mantenimiento) => {
        setSelectedMantenimiento(mantenimiento);
        setFormData({
            descripcion: mantenimiento.descripcion,
            fechaInicio: new Date(mantenimiento.fechaInicio).toISOString().split('T')[0],
            fechaFin: mantenimiento.fechaFin ? new Date(mantenimiento.fechaFin).toISOString().split('T')[0] : '',
            activoId: mantenimiento.activoId
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este mantenimiento?')) {
            try {
                await mantenimientoService.deleteMantenimiento(id);
                loadMantenimientos(selectedActivoId);
            } catch (err) {
                setError('Error al eliminar el mantenimiento');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            descripcion: '',
            fechaInicio: new Date().toISOString().split('T')[0],
            fechaFin: '',
            activoId: selectedActivoId
        });
        setIsEditing(false);
        setSelectedMantenimiento(null);
    };

    if (loading && !activos.length) return <div>Cargando...</div>;

    return (
        <div className="mantenimientos-dashboard">
            <h2>{isEditing ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}</h2>

            <div className="activo-selector">
                <label>Seleccionar Activo:</label>
                <select 
                    value={selectedActivoId} 
                    onChange={(e) => setSelectedActivoId(e.target.value)}
                >
                    {activos.map(activo => (
                        <option key={activo.id} value={activo.id}>
                            {activo.nombre} - {activo.tipo}
                        </option>
                    ))}
                </select>
            </div>
            
            <form onSubmit={handleSubmit} className="mantenimiento-form">
                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Fecha Inicio:</label>
                    <input
                        type="date"
                        value={formData.fechaInicio}
                        onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Fecha Fin:</label>
                    <input
                        type="date"
                        value={formData.fechaFin}
                        onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                    />
                </div>

                <div className="button-group">
                    <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
                    {isEditing && (
                        <button type="button" onClick={resetForm}>Cancelar</button>
                    )}
                </div>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="mantenimientos-list">
                <h3>Lista de Mantenimientos</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mantenimientos.map(mantenimiento => (
                            <tr key={mantenimiento.id}>
                                <td>{mantenimiento.descripcion}</td>
                                <td>{new Date(mantenimiento.fechaInicio).toLocaleDateString()}</td>
                                <td>{mantenimiento.fechaFin ? new Date(mantenimiento.fechaFin).toLocaleDateString() : '-'}</td>
                                <td>
                                    <button onClick={() => handleEdit(mantenimiento)}>Editar</button>
                                    <button onClick={() => handleDelete(mantenimiento.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MantenimientosDashboard;