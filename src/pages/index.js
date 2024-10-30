// src/pages/index.js
import Head from 'next/head';
import Formulario from '../components/Formulario';
import TablaCupos from '../components/TablaCupos';
import TablaInscritos from '../components/TablaInscritos';

export default function Home() {
    return (
        <div className="main-container">
            <Head>
                <title>Formulario de Registro</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Página de registro para conferencias" />
            </Head>

            <Formulario />
            <TablaCupos />
            <div style={{ marginTop: '2rem' }}>
                <TablaInscritos />
            </div>
        </div>
    );
}
