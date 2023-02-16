import Navigation from '@/Components/Navigation';
import '@/styles/globals.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Aside from '../Components/Aside';

export default function App({ Component, pageProps }) {
  const [reload, setReload] = useState(true);
  const [index, setIndex] = useState('Home');
  const { asPath } = useRouter();

  const getLayout =
    Component.getLayout ||
    ((page) => {
      return (
        <div>
          <Head>
            <title>Twitter - {asPath}</title>
          </Head>
          <div className="flex justify-center">
            <Navigation
              index={index}
              setIndex={setIndex}
              reload={reload}
              setReload={setReload}
            />
            <div className="h-screen overflow-y-scroll overflow-x-hidden scrollbar-hide">
              {page}
            </div>
            <Aside />
            <ToastContainer />
          </div>
        </div>
      );
    });

  return getLayout(
    <Component
      {...pageProps}
      reload={reload}
      setReload={setReload}
      index={index}
      setIndex={setIndex}
    />
  );
}
