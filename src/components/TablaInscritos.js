// src/components/TablaInscritos.js
import React, { useMemo, useEffect, useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import { useTable } from 'react-table';

// Función para convertir IDs de conferencias en nombres (como lista)
const obtenerNombresConferencias = (ids, conferencias) => {
    if (!ids || conferencias.length === 0) return [];
    const idArray = ids.split(',');
    return idArray
        .map((id) => {
            const conferencia = conferencias.find((conf) => conf.id === parseInt(id, 10));
            return conferencia ? conferencia.conferencia : 'Desconocido';
        });
};

export default function TablaInscritos() {
    const [inscritos, setInscritos] = useState([]);
    const [conferencias, setConferencias] = useState([]);
    const [filtroConferencia, setFiltroConferencia] = useState('');

    useEffect(() => {
        fetch('/api/registrar?inscritos=true')
            .then((res) => res.json())
            .then((data) => setInscritos(data))
            .catch((error) => console.error('Error al cargar inscritos:', error));

        fetch('/api/registrar')
            .then((res) => res.json())
            .then((data) => setConferencias(data))
            .catch((error) => console.error('Error al cargar conferencias:', error));
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: 'Cédula',
                accessor: 'cedula',
                style: { width: '100px' },
            },
            {
                Header: 'Nombre',
                accessor: 'nombre',
                Cell: ({ value }) => value.toUpperCase(),
                style: { width: '150px' },
            },
            {
                Header: 'Apellido',
                accessor: 'apellido',
                Cell: ({ value }) => value.toUpperCase(),
                style: { width: '150px' },
            },
            {
                Header: 'Correo',
                accessor: 'correo',
                style: { width: '200px' },
            },
            {
                Header: 'Teléfono',
                accessor: 'telefono',
            },
            {
                Header: 'Conferencias',
                accessor: (row) => obtenerNombresConferencias(row.conferencias, conferencias),
                Cell: ({ value }) => (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {(Array.isArray(value) ? value : []).map((conferencia, index) => (
                            <li key={index}>{conferencia}</li>
                        ))}
                    </ul>
                ),
            },
        ],
        [conferencias]
    );

    const data = useMemo(
        () =>
            filtroConferencia
                ? inscritos.filter((item) =>
                      obtenerNombresConferencias(item.conferencias, conferencias).includes(filtroConferencia)
                  )
                : inscritos,
        [inscritos, filtroConferencia, conferencias]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Listado de Inscritos</h2>

            {/* Filtro por Conferencia */}
            <Form.Group controlId="filtroConferencia" className="mb-3">
                <Form.Label>Filtrar por Conferencia</Form.Label>
                <Form.Control
                    as="select"
                    value={filtroConferencia}
                    onChange={(e) => setFiltroConferencia(e.target.value)}
                >
                    <option value="">Todas las conferencias</option>
                    {conferencias.map((conf) => (
                        <option key={conf.id} value={conf.conferencia}>
                            {conf.conferencia}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <div className="table-responsive">
                <Table {...getTableProps()} striped bordered hover responsive className="table">
                    <thead className="table-primary">
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps({ style: column.style })} key={column.id}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={row.id}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()} key={cell.column.id}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
