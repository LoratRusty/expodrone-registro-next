// src/components/TablaCupos.js
import { useState, useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';

export default function TablaCupos() {
    const [cupos, setCupos] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
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
        <div className="container mt-4">
            <h2 className="text-center mb-4">Listado de Conferencias</h2>
            <div className="table-responsive">
                <table id="tablaCupos" className="table table-striped table-bordered w-100">
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
