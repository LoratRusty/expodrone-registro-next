// src/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.10.25/css/jquery.dataTables.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.10.25/css/dataTables.bootstrap5.min.css"
        />
        <script
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          integrity="sha384-KyZXEAg3QhqLMpG8r+Knujsl7/IV0XtN1Vh6X56mMv25y8f8OCogZl5U1Uyh3y5t"
          crossOrigin="anonymous"
          defer
        ></script>
        <script
          src="https://cdn.datatables.net/1.10.25/js/jquery.dataTables.min.js"
          defer
        ></script>
        <script
          src="https://cdn.datatables.net/1.10.25/js/dataTables.bootstrap5.min.js"
          defer
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
