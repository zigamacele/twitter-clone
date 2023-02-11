import { Html, Head, Main, NextScript } from 'next/document';
import Navigation from '@/Components/Navigation';
import { ToastContainer } from 'react-toastify';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="h-screen bg-black text-white overflow-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
