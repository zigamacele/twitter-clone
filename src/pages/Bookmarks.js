import React, { useState } from 'react';
import AllTweets from '../Components/AllTweets';

export default function Bookmarks({ reload, setReload, index }) {
  return (
    <div>
      <div className="flex justify-center">
        <div className="border border-gray-800 w-[35em]">
          <p className="sticky top-0 backdrop-blur py-5 px-3 font-bold text-xl border border-gray-800 ">
            Bookmarks
          </p>
          <div className="flex flex-col scrollbar-hide">
            <AllTweets reload={reload} setReload={setReload} index={index} />
          </div>
        </div>
      </div>
    </div>
  );
}
