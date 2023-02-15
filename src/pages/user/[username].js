import AllTweets from '@/Components/AllTweets';
import ProfileElement from '@/Components/ProfileElement';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { VscArrowLeft } from 'react-icons/vsc';

export default function Profile({ reload, setReload, index, setIndex }) {
  const router = useRouter();
  const username = router.query.username;

  useEffect(() => {
    setIndex('userTweets');
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col border border-gray-800 w-[35em]">
        <div className="flex items-center sticky top-0 backdrop-blur py-5 px-3 font-bold text-xl border-b bg-black/60 border-gray-800 z-20">
          <VscArrowLeft
            className="text-xl ml-4 mr-6 cursor-pointer"
            onClick={() => {
              router.push('/Home');
              setIndex('Home');
            }}
          />
          <p className="">Profile</p>
        </div>
        <ProfileElement
          reload={reload}
          setReload={setReload}
          index={index}
          setIndex={setIndex}
        />
        <div className="flex flex-col scrollbar-hide">
          <AllTweets
            reload={reload}
            setReload={setReload}
            index={index}
            setIndex={setIndex}
            username={username}
          />
        </div>
      </div>
    </div>
  );
}
