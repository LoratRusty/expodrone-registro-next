// src/pages/index.js
import Formulario from '../components/Formulario';
import TablaCupos from '../components/TablaCupos';
import TablaInscritos from '../components/TablaInscritos'; // Importa TablaInscritos

export default function Home() {
    return (
        <div>
            <Formulario />
            <TablaCupos />
            {/* Tabla de Usuarios Registrados */}
            <div style={{ marginTop: '2rem' }}>
                <TablaInscritos />
            </div>
        </div>
    );
}
