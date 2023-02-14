import React from 'react';
import { useRouter, router } from 'next/router';
import Tweet from '@/Components/Tweet';
import AllTweets from '@/Components/AllTweets';
import { VscArrowLeft } from 'react-icons/vsc';

export default function Bookmarks({ reload, setReload, index, setIndex }) {
  const router = useRouter();
  const tweetID = router.query.tweet;

  return (
    <div className="flex justify-center">
      <div className="flex flex-col border border-gray-800 w-[35em]">
        <div className="flex items-center">
          <VscArrowLeft
            className="text-xl ml-4 mr-6 cursor-pointer"
            onClick={() => {
              router.push('/Home');
              setIndex('Home');
            }}
          />
          <p className="sticky top-0 backdrop-blur py-5 px-3 font-bold text-xl  ">
            Tweet
          </p>
        </div>
        <div className="flex flex-col scrollbar-hide">
          <AllTweets
            reload={reload}
            setReload={setReload}
            index={index}
            setIndex={setIndex}
            tweetID={tweetID}
          />
          <Tweet reload={reload} setReload={setReload} />
          <AllTweets
            reload={reload}
            setReload={setReload}
            index={index}
            setIndex={setIndex}
            tweetID={tweetID}
            replies={true}
          />
        </div>
      </div>
    </div>
  );
}
