import { Html, Head, Main, NextScript } from 'next/document';
import Navigation from '@/Components/Navigation';
import { ToastContainer } from 'react-toastify';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-black text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
