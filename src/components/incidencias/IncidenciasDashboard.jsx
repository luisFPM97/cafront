import React, { useState, useEffect } from 'react';
import { incidenciaService } from '../../services/incidenciaService';
import { usuarioService } from '../../services/usuarioService';
import { activoService } from '../../services/activoService';
import './IncidenciasDashboard.css';

const IncidenciasDashboard = () => {
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('userToken');
        if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload).id;
        }
        return null;
    };
    const [incidencias, setIncidencias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [activos, setActivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [selectedIncidencia, setSelectedIncidencia] = useState(null);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        estado: 'solicitada',
        activoId: '',
        usuarioSolicitanteId: getUserIdFromToken(), // Usuario actual
        usuarioAsignadoId: ''
    });

    

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [incidenciasData, usuariosData, activosData] = await Promise.all([
                incidenciaService.getAllIncidencias(),
                usuarioService.getAllUsers(),
                activoService.getAllActivos()
            ]);
            setIncidencias(incidenciasData);
            console.log(incidenciasData);
            setUsuarios(usuariosData);
            console.log(usuariosData)
            setActivos(activosData);
            console.log(activosData)
        } catch (err) {
            setError('Error cargando datos');
        } finally {
            setLoading(false);
        }
    };

    const loadActivos = async () => {
        try {
            const data = await activoService.getAllActivos();
            setActivos(data);
        } catch (err) {
            setError('Error cargando activos');
        }
    };

    useEffect(() => {
        loadInitialData();
        loadActivos(); // Agregamos la carga de activos
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await incidenciaService.updateIncidencia(selectedIncidencia.id, formData);
            } else {
                await incidenciaService.createIncidencia(formData);
            }
            loadInitialData();
            resetForm();
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Error al guardar la incidencia');
        }
    };

    const handleEdit = (incidencia) => {
        setSelectedIncidencia(incidencia);
        setFormData({
            titulo: incidencia.titulo,
            descripcion: incidencia.descripcion,
            estado: incidencia.estado,
            activoId: incidencia.activoId,
            usuarioSolicitanteId: incidencia.usuarioSolicitanteId,
            usuarioAsignadoId: incidencia.usuarioAsignadoId || ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta incidencia?')) {
            try {
                await incidenciaService.deleteIncidencia(id);
                loadInitialData();
            } catch (err) {
                setError('Error al eliminar la incidencia');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            titulo: '',
            descripcion: '',
            estado: 'solicitada',
            activoId: '',
            usuarioSolicitanteId: getUserIdFromToken(),
            usuarioAsignadoId: ''
        });
        setIsEditing(false);
        setSelectedIncidencia(null);
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="incidencias-dashboard">
            
            

            <div className="incidencias-list">
                <h3>Lista de Incidencias</h3>
                <hr />
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Estado</th>
                            <th>Activo</th>
                            <th>Solicitante</th>
                            <th>Técnico</th>
                            <th>Fecha Solicitud</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidencias.map(incidencia => (
                            <tr key={incidencia.id}>
                                <td>{incidencia.titulo}</td>
                                <td>{incidencia.estado}</td>
                                <td>{incidencia.activo?.nombre}</td>
                                <td>{incidencia.solicitante?.nombre}</td>
                                <td>{incidencia.asignado?.nombre || 'Sin asignar'}</td>
                                <td>{new Date(incidencia.fechaSolicitud).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEdit(incidencia)}>Editar</button>
                                    <button onClick={() => handleDelete(incidencia.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h2>{isEditing ? 'Editar Incidencia' : 'Nueva Incidencia'}</h2>
            <form onSubmit={handleSubmit} className="incidencia-form">
                <div className="form-group">
                    <label>Título:</label>
                    <input
                        type="text"
                        value={formData.titulo}
                        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Activo:</label>
                    <select
                        value={formData.activoId}
                        onChange={(e) => setFormData({...formData, activoId: e.target.value})}
                        required
                    >
                        <option value="">Seleccione un activo</option>
                        {activos.map(activo => (
                            <option key={activo.id} value={activo.id}>
                                {activo.nombre} - {activo.tipo}
                            </option>
                        ))}
                    </select>
                </div>

                {isEditing && (
                    <>
                        <div className="form-group">
                            <label>Estado:</label>
                            <select
                                value={formData.estado}
                                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                            >
                                <option value="solicitada">Solicitada</option>
                                <option value="asignado">Asignado</option>
                                <option value="terminado">Terminado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Técnico Asignado:</label>
                            <select
                                value={formData.usuarioAsignadoId}
                                onChange={(e) => setFormData({...formData, usuarioAsignadoId: e.target.value})}
                            >
                                <option value="">Sin asignar</option>
                                {usuarios
                                    .filter(usuario => usuario.rol === 'técnico')
                                    .map(usuario => (
                                        <option key={usuario.id} value={usuario.id}>
                                            {usuario.nombre}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </>
                )}

                <div className="button-group">
                    <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
                    {isEditing && (
                        <button type="button" onClick={resetForm}>Cancelar</button>
                    )}
                </div>
            </form>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default IncidenciasDashboard;