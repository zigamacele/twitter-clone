import React, { useState } from 'react';
import { router } from 'next/router';
import Image from 'next/image';
import LoadingScreen from '@/pages/LoadingScreen';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { onSnapshot, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/pages/firebase-config';
import Logo from '@/images/twitter-logo-white.png';

import { FiBookmark } from 'react-icons/fi';
import { BiUser, BiBell } from 'react-icons/bi';
import { AiOutlineHome } from 'react-icons/ai';
import { TbSearch, TbDotsCircleHorizontal, TbMail } from 'react-icons/tb';
import { BsCardChecklist } from 'react-icons/bs';
import { RiQuillPenLine, RiCloseLine } from 'react-icons/ri';
import { BsThreeDots } from 'react-icons/bs';
import Tweet from '@/pages/Tweet';

export default function Navigation() {
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState();
  const [newTweet, setNewTweet] = useState(false);
  const auth = getAuth();
  // const pullCurrentUser = onSnapshot(
  //   doc(db, 'users', getAuth().currentUser.uid),
  //   (doc) => {
  //     setCurrentUser(doc.data());
  //   }
  // );

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const pullCurrentUser = onSnapshot(
        doc(db, 'users', getAuth().currentUser.uid),
        (doc) => {
          setCurrentUser(doc.data());
        }
      );
    }
  });

  return (
    <div className="h-screen flex flex-col justify-between bg-black text-white">
      {!newTweet ? null : (
        <div
          onClick={() => setNewTweet(false)}
          className="absolute absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-gray-700 bg-opacity-80"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-center bg-black  pt-6 px-10 pb-10 rounded-xl"
          >
            <RiCloseLine
              className="text-2xl font-light mb-2 cursor-pointer"
              onClick={() => setNewTweet(false)}
            />
            <Tweet />
          </div>
        </div>
      )}
      {loading ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoadingScreen />
        </div>
      ) : null}
      <div className=" flex flex-col gap-8 mr-12 my-4">
        <Image src={Logo} alt="twitter-logo" className="w-7" />
        <div className="flex flex-col gap-5 text-xl font-light">
          <div className="flex items-center gap-5 font-bold">
            <AiOutlineHome />
            <p>Home</p>
          </div>
          <div className="flex items-center gap-4 cursor-not-allowed">
            <TbSearch />
            <p>Explore</p>
          </div>
          <div className="flex items-center gap-4 cursor-not-allowed">
            <BiBell />
            <p>Notification</p>
          </div>
          <div className="flex items-center gap-4 cursor-not-allowed">
            <TbMail />
            <p>Messages</p>
          </div>
          <div className="flex items-center gap-4">
            <FiBookmark />
            <p>Bookmarks</p>
          </div>
          <div className="flex items-center gap-4 cursor-not-allowed">
            <BsCardChecklist />
            <p>Lists</p>
          </div>
          <div className="flex items-center gap-4">
            <BiUser />
            <p>Profile</p>
          </div>
          <div className="flex items-center gap-4">
            <TbDotsCircleHorizontal />
            <p>More</p>
          </div>
          <div
            onClick={() => setNewTweet(true)}
            className="flex items-center gap-4 font-bold text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-full  self-center py-3 px-20 text-base cursor-pointer"
          >
            {/* <RiQuillPenLine /> */}
            <button>Tweet</button>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-52 mr-6 my-4 items-center">
        <div className="flex">
          <div>
            <img
              src={currentUser.profilePicURL}
              alt="profile-picture"
              className="w-10 rounded-full mr-3"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold">{currentUser.displayName}</p>
            <p className="text-l text-gray-400">@{currentUser.username}</p>
          </div>
        </div>

        <BsThreeDots
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              signOut(auth);
              router.push('/login');
            }, 2000);
          }}
        />
      </div>
    </div>
  );
}
