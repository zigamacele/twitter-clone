import Navigation from '@/Components/Navigation';
import '@/styles/globals.css';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Aside from '../Components/Aside';

export default function App({ Component, pageProps }) {
  const [reload, setReload] = useState(true);
  const [index, setIndex] = useState('Home');

  const getLayout =
    Component.getLayout ||
    ((page) => {
      return (
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
