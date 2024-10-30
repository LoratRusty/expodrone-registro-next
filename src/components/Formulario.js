import { useState, useEffect } from 'react';

export default function Formulario() {
    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        conferencias: [] // Array para almacenar conferencias seleccionadas
    });
    const [conferencias, setConferencias] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [alertType, setAlertType] = useState(''); // success o danger

    useEffect(() => {
        fetchConferencias();
    }, []);

    async function fetchConferencias() {
        try {
            const res = await fetch('/api/registrar');
            if (!res.ok) throw new Error('Error al obtener las conferencias');
            const data = await res.json();
            setConferencias(data);
        } catch (error) {
            console.error(error);
            setMensaje('Error al cargar conferencias. Intente de nuevo más tarde.');
            setAlertType('danger');
        }
    }

    const handleCheckboxChange = (e) => {
        const selectedConferencia = parseInt(e.target.value); // Aseguramos que sea un número
        let updatedConferencias = [...formData.conferencias];

        if (updatedConferencias.includes(selectedConferencia)) {
            // Remover la conferencia si ya está seleccionada
            updatedConferencias = updatedConferencias.filter(conf => conf !== selectedConferencia);
        } else {
            // Limitar la selección a un máximo de 3 conferencias
            if (updatedConferencias.length >= 3) {
                setMensaje('Solo puedes seleccionar hasta 3 conferencias');
                setAlertType('danger');
                return;
            }
            updatedConferencias.push(selectedConferencia);
        }

        setMensaje(''); // Limpiar cualquier mensaje de error
        setFormData({ ...formData, conferencias: updatedConferencias });
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.conferencias.length === 0) {
            setMensaje('Debes seleccionar al menos una conferencia');
            setAlertType('danger');
            return;
        }

        try {
            const res = await fetch('/api/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setMensaje('Inscripción exitosa');
                setAlertType('success');
                setFormData({
                    cedula: '',
                    nombre: '',
                    apellido: '',
                    correo: '',
                    telefono: '',
                    conferencias: []
                });
                fetchConferencias();
            } else {
                setMensaje(data.message || 'Error al enviar el formulario');
                setAlertType('danger');
            }
        } catch (error) {
            console.error(error);
            setMensaje('Error en el envío. Intente de nuevo más tarde.');
            setAlertType('danger');
        }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white">
                            <h2 className="text-center mb-0">Registro de Oyentes / Participantes</h2>
                        </div>
                        <div className="card-body">
                            {mensaje && (
                                <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                                    <strong>{alertType === 'success' ? '¡Éxito!' : '¡Error!'}</strong> {mensaje}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setMensaje('')}
                                        aria-label="Close"
                                    ></button>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="row g-3">
                                <div className="col-md-12">
                                    <label htmlFor="cedula" className="form-label">Cédula</label>
                                    <input
                                        type="number"
                                        id="cedula"
                                        value={formData.cedula}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label htmlFor="nombre" className="form-label">Nombres</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label htmlFor="apellido" className="form-label">Apellidos</label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        id="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        pattern="[0-9]{11}"
                                        placeholder="Solo números"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label">Conferencias (máximo 3)</label>
                                    <div className="row row-cols-1 g-2 mt-2">
                                        {conferencias.map((conf) => (
                                            <div key={conf.id} className="col">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={conf.id}
                                                        onChange={handleCheckboxChange}
                                                        checked={formData.conferencias.includes(parseInt(conf.id))}
                                                        disabled={
                                                            conf.cupos_disponibles === 0 ||
                                                            (formData.conferencias.length >= 3 &&
                                                            !formData.conferencias.includes(parseInt(conf.id)))
                                                        }
                                                    />
                                                    <label className="form-check-label ms-2">
                                                        {conf.conferencia} - {conf.cupos_disponibles} cupos
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <small className="form-text text-muted">Selecciona hasta 3 conferencias.</small>
                                </div>

                                <div className="col-12 text-center">
                                    <button type="submit" className="btn btn-primary mt-3 w-50">Inscribirse</button>
                                </div>
                                {mensaje && (
                                <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                                    <strong>{alertType === 'success' ? '¡Éxito!' : '¡Error!'}</strong> {mensaje}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setMensaje('')}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
