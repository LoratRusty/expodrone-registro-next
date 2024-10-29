import Formulario from '@/components/Formulario';
import TablaCupos from '@/components/TablaCupos';
import '@/public/styles.css';

export default function Home() {
    return (
        <div>
            <h1>Registro de Conferencias Expodrone</h1>
            <Formulario />
            <TablaCupos />
        </div>
    );
}
