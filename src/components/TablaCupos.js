import { useState, useEffect } from 'react';

export default function TablaCupos() {
    const [cupos, setCupos] = useState([]);

    useEffect(() => {
        fetch('/api/registrar')
            .then((res) => res.json())
            .then((data) => setCupos(data));
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Listado de Conferencias</h2>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-primary">
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
                                <td>{cup.conferencia}</td>
                                <td>{cup.expositores}</td>
                                <td>{new Date(cup.dia).toLocaleDateString()}</td>
                                <td>{cup.cupos_disponibles}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
