// src/pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import '../styles/styles.css';

import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Cargar Bootstrap JS solo en el lado del cliente
        import('bootstrap/dist/js/bootstrap.bundle.min.js')
            .then(() => {
                console.log("Bootstrap JS cargado en el cliente");
            })
            .catch((error) => console.error("Error cargando Bootstrap JS:", error));
    }, []);
    
    return <Component {...pageProps} />;
}

export default MyApp;
