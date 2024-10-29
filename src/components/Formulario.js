import { useState, useEffect } from 'react';

export default function Formulario() {
    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        conferencia: ''
    });
    const [conferencias, setConferencias] = useState([]);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        fetchConferencias();
    }, []);

    async function fetchConferencias() {
        const res = await fetch('/api/registrar');
        const data = await res.json();
        setConferencias(data);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        setMensaje(data.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Campos del formulario */}
            <label htmlFor="cedula">Cédula:</label>
            <input type="number" id="cedula" onChange={handleChange} required />

            {/* Campos adicionales */}
            <label htmlFor="conferencia">Conferencia:</label>
            <select id="conferencia" onChange={handleChange} required>
                <option value="">Seleccione una conferencia</option>
                {conferencias.map((conf) => (
                    <option key={conf.id} value={conf.id}>
                        {conf.nombre} - {conf.disponibles} cupos
                    </option>
                ))}
            </select>
            <button type="submit">Inscribirse</button>
            <p>{mensaje}</p>
        </form>
    );
}
