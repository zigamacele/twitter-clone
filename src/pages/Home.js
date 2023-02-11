import React from 'react';
import Navigation from '@/Components/Navigation';
import SelectUsername from '@/Components/SelectUsername';
import Aside from '@/pages/Aside';
import Tweet from '@/pages/Tweet';
import AllTweets from './AllTweets';

export default function Home() {
  return (
    <div className="">
      <SelectUsername />
      <div className="flex justify-center">
        <Navigation />
        <div>
          <p>Home</p>
          <div className="flex flex-col">
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
