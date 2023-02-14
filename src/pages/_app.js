import '@/styles/globals.css';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from '@/Components/Navigation';
import Aside from '../Components/Aside';

export default function App({ Component, pageProps }) {
  const [reload, setReload] = useState(true);
  const [index, setIndex] = useState('Home');
  const [logout, setLogout] = useState(true);

  useEffect(() => {
    setLogout(JSON.parse(sessionStorage.getItem('logout')));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('logout', logout);
  }, [logout]);

  return (
    <div className="flex justify-center">
      {logout === true ? null : (
        <Navigation
          index={index}
          setIndex={setIndex}
          reload={reload}
          setReload={setReload}
          setLogout={setLogout}
        />
      )}
      <div className="h-screen overflow-scroll scrollbar-hide">
        <Component
          {...pageProps}
          reload={reload}
          setReload={setReload}
          index={index}
          setIndex={setIndex}
          setLogout={setLogout}
        />
      </div>
      {logout === true ? null : <Aside />}
      <ToastContainer />
    </div>
  );
}
