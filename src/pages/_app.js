// src/pages/_app.js

/* eslint-disable @typescript-eslint/no-require-imports */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import '../styles/styles.css';

import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js'); // Para asegurarse de que JavaScript de Bootstrap esté disponible
    }, []);
    
    return <Component {...pageProps} />;
}

export default MyApp;
