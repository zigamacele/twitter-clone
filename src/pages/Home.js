import React from 'react';
import Navigation from '@/Components/Navigation';
import SelectUsername from '@/Components/SelectUsername';
import Aside from '@/pages/Aside';
import Tweet from '@/pages/Tweet';
import AllTweets from './AllTweets';

export default function Home() {
  return (
    <div>
      <SelectUsername />
      <div className="flex justify-center">
        <Navigation />
        <div className="border border-gray-800">
          <p className="py-5 px-3 font-bold text-xl border border-gray-800">
            Home
          </p>
          <div className="flex flex-col overflow-scroll h-screen scrollbar-hide">
            <Tweet />
            <AllTweets />
          </div>
        </div>
        <Aside />
      </div>
    </div>
  );
}

//!! SAVE ALL TWEETS TOGETHER AND THEN FILTER THEM ON PROFILE
