// src/pages/index.js
import Formulario from '../components/Formulario';
import TablaCupos from '../components/TablaCupos';
import TablaInscritos from '../components/TablaInscritos'; // Importa TablaInscritos

export default function Home() {
    return (
        <div>
            <h1>Registro de Conferencias Expodrone</h1>
            <Formulario />
            <TablaCupos />

            {/* Tabla de Usuarios Registrados */}
            <div style={{ marginTop: '2rem' }}>
                <TablaInscritos />
            </div>
        </div>
    );
}
