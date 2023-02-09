import React from 'react';
import Navigation from '@/Components/Navigation';
import SelectUsername from '@/Components/SelectUsername';

export default function Home() {
  return (
    <div>
      <SelectUsername />
      <Navigation />
    </div>
  );
}

//!! database: users, all-tweets
