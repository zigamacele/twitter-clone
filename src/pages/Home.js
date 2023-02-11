import React from 'react';
import Navigation from '@/Components/Navigation';
import SelectUsername from '@/Components/SelectUsername';
import Aside from '@/pages/Aside';
import Tweet from '@/pages/Tweet';

export default function Home() {
  return (
    <>
      <SelectUsername />
      <div className="flex justify-center">
        <Navigation />
        <div>
          <p>Home</p>
          <Tweet />
        </div>
        <Aside />
      </div>
    </>
  );
}

//!! USERNAME ALREADY EXISTS
