import '../styles/globals.css'
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico?v=2" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
