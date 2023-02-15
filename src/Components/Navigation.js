import LoadingScreen from '@/Components/LoadingScreen';
import Tweet from '@/Components/Tweet';
import { db } from '@/firebase-config';
import Logo from '@/images/twitter-logo-white.png';
import { Popover } from '@headlessui/react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { router } from 'next/router';
import React, { useState } from 'react';
import { Animate } from 'react-simple-animate';

import { AiOutlineHome } from 'react-icons/ai';
import { BiBell, BiUser } from 'react-icons/bi';
import { BsCardChecklist, BsThreeDots } from 'react-icons/bs';
import { FiBookmark, FiLogOut } from 'react-icons/fi';
import { RiCloseLine, RiQuillPenLine } from 'react-icons/ri';
import { TbDotsCircleHorizontal, TbMail, TbSearch } from 'react-icons/tb';

export default function Navigation({ index, setIndex, reload, setReload }) {
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState();
  const [newTweet, setNewTweet] = useState(false);
  const auth = getAuth();

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
    <div className="h-screen flex flex-col justify-between media:w-[20em] mr-1">
      {!newTweet ? null : (
        <div
          onClick={() => setNewTweet(false)}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-gray-700 bg-opacity-80 z-40"
        >
          <Animate play start={{ opacity: 0 }} end={{ opacity: 1 }}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 justify-center bg-black  pt-6 px-10 pb-10 rounded-xl"
            >
              <RiCloseLine
                className="text-2xl font-light mb-2 cursor-pointer"
                onClick={() => setNewTweet(false)}
              />
              <Tweet reload={reload} setReload={setReload} />
            </div>
          </Animate>
        </div>
      )}
      {loading ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoadingScreen />
        </div>
      ) : null}
      <div className=" flex flex-col gap-8 xl:mr-44 my-4 justify-center items-end w-full">
        <div className="flex flex-col gap-2 text-[22px] font-light">
          <Image
            src={Logo}
            alt="twitter-logo"
            className="w-7 ml-2 xl:ml-3 mb-2"
          />

          <div
            onClick={() => {
              setIndex('Home');
              router.push('/Home');
            }}
            className="flex items-center gap-5 cursor-pointer "
          >
            <div className="  flex items-center gap-5 hover:bg-gray-800 p-2 xl:pl-3 xl:pr-8 rounded-full">
              <AiOutlineHome className="text-2xl" />
              <p
                style={{ fontWeight: index === 'Home' ? 700 : 400 }}
                className="hidden xl:block"
              >
                Home
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 cursor-not-allowed">
            <div className="  flex items-center gap-5 hover:bg-gray-800 p-2 xl:pl-3 xl:pr-8 rounded-full">
              <TbSearch className="text-2xl" />
              <p className="hidden xl:block">Explore</p>
            </div>
          </div>
          <div className="flex items-center gap-4 cursor-not-allowed">
            <div className="  flex items-center gap-5 hover:bg-gray-800 p-2 xl:pl-3 xl:pr-8 rounded-full">
              <BiBell className="text-2xl" />
              <p className="hidden xl:block">Notification</p>
            </div>
          </div>
          <div className="flex items-center gap-4 cursor-not-allowed">
            <div className="  flex items-center gap-5 hover:bg-gray-800 p-2 xl:pl-3 xl:pr-8 rounded-full">
              <TbMail className="text-2xl" />
              <p className="hidden xl:block">Messages</p>
            </div>
          </div>
          <div
            onClick={() => {
              router.push('/Bookmarks');
              setIndex('Bookmarks');
            }}
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="  flex items-center gap-5 hover:bg-gray-800 p-2 xl:pl-3 xl:pr-8 rounded-full">
              <FiBookmark className="text-2xl" />
              <p
                style={{ fontWeight: index === 'Bookmarks' ? 700 : 400 }}
                className="hidden xl:block"
              >
                Bookmarks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 cursor-not-allowed">
            <div className="  flex items-center gap-5 hover:bg-gray-800 p-2 xl:pl-3 xl:pr-8 rounded-full">
              <BsCardChecklist className="text-2xl" />
              <p className="hidden xl:block">Lists</p>
            </div>
          </div>
          <div
            onClick={() => {
              router.push(`/user/${currentUser.username}`);
              setIndex('userTweets');
              setReload(!reload);
            }}
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="  flex items-center gap-5 hover:bg-gray-800 p-2 xl:pl-3 xl:pr-8 rounded-full">
              <BiUser className="text-2xl" />
              <p
                style={{
                  fontWeight:
                    index === 'userTweets' ||
                    index === 'userMedia' ||
                    index === 'userLikes' ||
                    index === 'userReplies'
                      ? 700
                      : 400,
                }}
                className="hidden xl:block"
              >
                Profile
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 cursor-not-allowed">
            <div className="  flex items-center gap-5 hover:bg-gray-800 p-2 xl:pl-3 xl:pr-8 rounded-full">
              <TbDotsCircleHorizontal className="text-2xl" />
              <p className="hidden xl:block">More</p>
            </div>
          </div>
          <div
            onClick={() => setNewTweet(true)}
            className="mt-3 xl:flex xl:items-center gap-4 font-bold text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-full py-3 sm:px-3 xl:px-24 text-base cursor-pointer w-10 mr-4 xl:justify-center"
          >
            <RiQuillPenLine className="xl:hidden" />
            <button className="hidden xl:inline">Tweet</button>
          </div>
        </div>
      </div>
      <div className="flex sm:flex-col xl:flex-row sm:gap-2 xl:justify-between xl:w-52 mr-1 my-4 items-center self-end">
        <div className="flex">
          <div>
            <img
              src={currentUser.profilePicURL}
              alt="profile-picture"
              className="w-10 h-10 object-cover rounded-full mr-3"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold xl:inline hidden">
              {currentUser.displayName}
            </p>
            <p className="text-l text-gray-400 xl:inline hidden">
              @{currentUser.username}
            </p>
          </div>
        </div>
        <div className="relative">
          <Popover>
            <Popover.Button>
              <BsThreeDots className="sm:mr-3" />
            </Popover.Button>
            <Popover.Panel className="absolute flex bottom-12 right-1.5 flex-col b-50 z-50 bg-black rounded-xl shadow-3xl z-10">
              <Animate play start={{ opacity: 0 }} end={{ opacity: 1 }}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    // setLoading(true);
                    signOut(auth);
                    router.push('/login');
                  }}
                  className="flex items-center gap-2 font-bold pl-4 pr-16 py-2 hover:bg-gray-800 cursor-pointer"
                >
                  <FiLogOut />

                  <p>Logout</p>
                </div>
              </Animate>
            </Popover.Panel>
          </Popover>
        </div>
      </div>
    </div>
  );
}
