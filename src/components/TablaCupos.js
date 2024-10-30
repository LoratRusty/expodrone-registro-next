import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Cargar DataTables y jQuery solo en el lado del cliente
const $ = typeof window !== 'undefined' ? require('jquery') : () => {};

if (typeof window !== 'undefined') {
    require('datatables.net-bs5');
    require('datatables.net-responsive-bs5');
}

export default function TablaCupos() {
    const [cupos, setCupos] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Cargar datos y configurar DataTables
            fetch('/api/registrar')
                .then((res) => res.json())
                .then((data) => {
                    setCupos(data);
                    $('#tablaCupos').DataTable({
                        responsive: true,
                        autoWidth: false,
                        language: {
                            url: 'https://cdn.datatables.net/plug-ins/2.1.8/i18n/es-ES.json'
                        }
                    });
                });

            // Limpiar DataTable al desmontar el componente
            return () => {
                if ($.fn.DataTable.isDataTable('#tablaCupos')) {
                    $('#tablaCupos').DataTable().destroy();
                }
            };
        }
    }, []);

    return (
        <div className="container-fluid mt-4">
            <h2 className="text-center mb-4">Listado de Conferencias</h2>
            <div className="table-responsive">
                <table id="tablaCupos" className="table table-striped table-bordered">
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
