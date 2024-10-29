import { useState, useEffect } from 'react';

export default function TablaCupos() {
    const [cupos, setCupos] = useState([]);

    useEffect(() => {
        fetch('/api/registrar')
            .then((res) => res.json())
            .then((data) => setCupos(data));
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>Conferencia</th>
                    <th>Expositores</th>
                    <th>Día</th>
                    <th>Cupos Disponibles</th>
                </tr>
            </thead>
            <tbody>
                {cupos.map((cup) => (
                    <tr key={cup.id}>
                        <td>{cup.nombre}</td>
                        <td>{cup.expositor}</td>
                        <td>{cup.dia}</td>
                        <td>{cup.disponibles}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
