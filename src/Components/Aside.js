import React from 'react';

import { TbSearch } from 'react-icons/tb';
import { BsThreeDots } from 'react-icons/bs';

export default function Aside() {
  return (
    <div className="media:flex media:flex-col media:gap-3 media:mt-3 media:ml-8 media:w-[20em] hidden">
      <div className="flex gap-2 items-center cursor-not-allowed bg-gray-800 rounded-full px-4 py-3 text-gray-500 text-sm">
        <TbSearch />
        <p>Search Twitter</p>
      </div>

      <div className="flex flex-col gap-4 bg-gray-800 px-4 py-4 rounded-2xl">
        <p className="font-bold text-xl">Trends for you</p>
        <div className="flex flex-col font-light text-xs cursor-not-allowed">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Trending</p>
            <BsThreeDots />
          </div>
          <p className="font-bold text-base">Gura</p>
          <p className="text-gray-400">11K Tweets</p>
        </div>
        <div className="flex flex-col font-light text-xs cursor-not-allowed">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Trending</p>
            <BsThreeDots />
          </div>
          <p className="font-bold text-base">Kobo</p>
          <p className="text-gray-400">7,357 Tweets</p>
        </div>
        <div className="flex flex-col font-light text-xs cursor-not-allowed">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Science • Trending</p>
            <BsThreeDots />
          </div>
          <p className="font-bold text-base">#ufoTwitter</p>
          <p className="text-gray-400">35K Tweets</p>
        </div>
        <div className="flex flex-col font-light text-xs cursor-not-allowed">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Entertainment • Trending</p>
            <BsThreeDots />
          </div>
          <p className="font-bold text-base">#BORUTO</p>
          <p className="text-gray-400">14.3K Tweets</p>
        </div>
        <div className="flex flex-col font-light text-xs cursor-not-allowed">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Gaming • Trending</p>
            <BsThreeDots />
          </div>
          <p className="font-bold text-base">#Splatoon3</p>
          <p className="text-gray-400">100K Tweets</p>
        </div>
        <div className="flex flex-col font-light text-xs cursor-not-allowed">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Trending</p>
            <BsThreeDots />
          </div>
          <p className="font-bold text-base">Freddy</p>
          <p className="text-gray-400">25.3K Tweets</p>
        </div>
      </div>
      <div>
        <p className="font-bold">Who to follow</p>
        <div></div>
      </div>
      <div className="flex flex-col gap-1 text-gray-400 font-light text-xs">
        <div className="flex gap-2">
          <p className="cursor-not-allowed">Terms of Service</p>
          <p className="cursor-not-allowed">Privacy Policy</p>
          <p className="cursor-not-allowed">Cookie Policy</p>
        </div>
        <div className="flex gap-2">
          <p className="cursor-not-allowed">Accessibility</p>
          <p className="cursor-not-allowed">Ads Info</p>
          <p className="cursor-not-allowed">More</p>
        </div>
        <p>© 2023 Twitter, Inc.</p>
      </div>
    </div>
  );
}
