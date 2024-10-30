// src/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link
                    href="https://cdn.datatables.net/1.11.3/css/dataTables.bootstrap5.min.css"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
                <script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-...integrity_hash..."
                    crossOrigin="anonymous"
                ></script>
                <script
                    src="https://cdn.datatables.net/1.11.3/js/jquery.dataTables.min.js"
                ></script>
                <script
                    src="https://cdn.datatables.net/1.11.3/js/dataTables.bootstrap5.min.js"
                ></script>
            </body>
        </Html>
    );
}
