import React, { useState, useEffect } from 'react';
import SelectUsername from '@/Components/SelectUsername';
import Tweet from '@/Components/Tweet';
import AllTweets from '../Components/AllTweets';

export default function Home({ reload, setReload, index }) {
  return (
    <div>
      <SelectUsername />
      <div className="flex justify-center">
        <div className="border border-gray-800">
          <p className="sticky top-0 backdrop-blur py-5 px-3 font-bold text-xl border border-gray-800">
            Home
          </p>
          <div className="flex flex-col scrollbar-hide">
            <Tweet reload={reload} setReload={setReload} />
            <AllTweets reload={reload} setReload={setReload} index={index} />
          </div>
        </div>
      </div>
    </div>
  );
}
