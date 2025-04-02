import React, { useState, useEffect } from 'react';
import { activoService } from '../../services/activoService';
import './ActivosDashboard.css';

const ActivosDashboard = () => {
    const [activos, setActivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedActivo, setSelectedActivo] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        tipo: 'portátil',
        estado: 'activo',
        descripcion: ''
    });

    useEffect(() => {
        loadActivos();
    }, []);

    const loadActivos = async () => {
        try {
            setLoading(true);
            const data = await activoService.getAllActivos();
            setActivos(data);
        } catch (err) {
            setError('Error cargando activos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await activoService.updateActivo(selectedActivo.id, formData);
            } else {
                await activoService.createActivo(formData);
            }
            loadActivos();
            resetForm();
        } catch (err) {
            setError('Error al guardar el activo');
        }
    };

    const handleEdit = (activo) => {
        setSelectedActivo(activo);
        setFormData({
            nombre: activo.nombre,
            tipo: activo.tipo,
            estado: activo.estado,
            descripcion: activo.descripcion
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este activo?')) {
            try {
                await activoService.deleteActivo(id);
                loadActivos();
            } catch (err) {
                setError('Error al eliminar el activo');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            tipo: 'portátil',
            estado: 'activo',
            descripcion: ''
        });
        setIsEditing(false);
        setSelectedActivo(null);
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="activos-dashboard">
            <h2>{isEditing ? 'Editar Activo' : 'Nuevo Activo'}</h2>
            
            <form onSubmit={handleSubmit} className="activo-form">
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Tipo:</label>
                    <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    >
                        <option value="portátil">Portátil</option>
                        <option value="escritorio">Escritorio</option>
                        <option value="servidor">Servidor</option>
                        <option value="impresora">Impresora</option>
                        <option value="licencia">Licencia</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Estado:</label>
                    <select
                        value={formData.estado}
                        onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
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

            <div className="activos-list">
                <h3>Lista de Activos</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activos.map(activo => (
                            <tr key={activo.id}>
                                <td>{activo.nombre}</td>
                                <td>{activo.tipo}</td>
                                <td>{activo.estado}</td>
                                <td>{activo.descripcion}</td>
                                <td>
                                    <button onClick={() => handleEdit(activo)}>Editar</button>
                                    <button onClick={() => handleDelete(activo.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivosDashboard;