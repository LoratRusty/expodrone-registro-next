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

    // Obtener las conferencias desde la API cuando el componente se monta
    useEffect(() => {
        fetchConferencias();
    }, []);

    // Función para obtener conferencias desde la API
    async function fetchConferencias() {
        try {
            const res = await fetch('/api/registrar');
            if (!res.ok) throw new Error('Error al obtener las conferencias');
            const data = await res.json();
            setConferencias(data); // Guarda los datos en el estado
        } catch (error) {
            console.error(error);
            setMensaje('Error al cargar conferencias. Intente de nuevo más tarde.');
        }
    }

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
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
                setMensaje(data.message);
                setFormData({
                    cedula: '',
                    nombre: '',
                    apellido: '',
                    correo: '',
                    telefono: '',
                    conferencia: ''
                }); // Resetea el formulario
            } else {
                setMensaje(data.message || 'Error al enviar el formulario');
            }
        } catch (error) {
            console.error(error);
            setMensaje('Error en el envío. Intente de nuevo más tarde.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="cedula">Cédula:</label>
            <input
                type="number"
                id="cedula"
                value={formData.cedula}
                onChange={handleChange}
                required
            />

            <label htmlFor="nombre">Nombres:</label>
            <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
            />

            <label htmlFor="apellido">Apellidos:</label>
            <input
                type="text"
                id="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
            />

            <label htmlFor="correo">Correo Electrónico:</label>
            <input
                type="email"
                id="correo"
                value={formData.correo}
                onChange={handleChange}
                required
            />

            <label htmlFor="telefono">Teléfono:</label>
            <input
                type="tel"
                id="telefono"
                pattern="[0-9]{10}"
                placeholder="Solo números"
                value={formData.telefono}
                onChange={handleChange}
                required
            />

            <label htmlFor="conferencia">Conferencia:</label>
            <select
                id="conferencia"
                value={formData.conferencia}
                onChange={handleChange}
                required
            >
                <option value="">Seleccione una conferencia</option>
                {conferencias.map((conf) => (
                    <option key={conf.id} value={conf.id}>
                        {conf.conferencia} - {conf.cupos_disponibles} cupos
                    </option>
                ))}
            </select>

            <button type="submit">Inscribirse</button>
            <p>{mensaje}</p>
        </form>
    );
}
