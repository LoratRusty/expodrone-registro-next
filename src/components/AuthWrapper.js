// src/components/AuthWrapper.js
import { useState } from 'react';
import TablaInscritos from './TablaInscritos';
import { Form, Button, Alert } from 'react-bootstrap';

export default function AuthWrapper() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        // La contraseña que quieres utilizar
        const correctPassword = 'America2019';
        
        if (password === correctPassword) {
            setIsAuthenticated(true);
            setErrorMessage('');
        } else {
            setErrorMessage('Contraseña incorrecta. Intente nuevamente.');
        }
    };

    return (
        <div className="container mt-5">
            {isAuthenticated ? (
                // Si está autenticado, muestra la tabla
                <TablaInscritos />
            ) : (
                // Formulario de autenticación
                <div className="d-flex flex-column align-items-center">
                    <h2 className="mb-4">Autenticación Requerida</h2>
                    <Form className="w-50">
                        <Form.Group controlId="password">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese la contraseña"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </Form.Group>
                        <Button variant="primary" className="mt-3" onClick={handleLogin}>
                            Ingresar
                        </Button>
                    </Form>
                    {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
                </div>
            )}
        </div>
    );
}
