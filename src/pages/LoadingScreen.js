import React from 'react';
import Image from 'next/image';
import Logo from '@/images/twitter-logo.webp';

export default function LoadingScreen() {
  return (
    <div className=" bg-black w-screen h-screen flex items-center justify-center">
      <Image
        src={Logo}
        alt="twitter-logo"
        className="object-sacle-down h-16 w-auto"
      />
    </div>
  );
}
