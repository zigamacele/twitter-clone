import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { db } from './firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  onSnapshot,
  addDoc,
  doc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import { RxImage } from 'react-icons/rx';
import {
  AiOutlineGif,
  AiOutlineSmile,
  AiOutlineCalendar,
} from 'react-icons/ai';

import { TbListDetails } from 'react-icons/tb';
import { TfiLocationPin } from 'react-icons/tfi';
import { BsGlobe2 } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';

export default function Tweet() {
  const [currentUser, setCurrentUser] = useState('');
  const [input, setInput] = useState('');
  const [inputLength, setInputLength] = useState(0);

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

  function handleChange(e) {
    const inputEventValue = e.target.value;
    if (inputEventValue.length > 140) return;
    setInput(inputEventValue);
    setInputLength(inputEventValue.length);
  }

  async function handleTweet() {
    await addDoc(collection(db, 'all-tweets'), {
      userID: getAuth().currentUser.uid,
      message: input,
      timestamp: serverTimestamp(),
    });

    toast.info('Your Tweet was sent', {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    setInput('');
    setInputLength(0);
  }

  return (
    <div className="flex  border-gray-800 p-3 text-blue-500 w-[30em] justify-start">
      <img
        src={currentUser.profilePicURL}
        alt="profile-picture"
        className="h-10 rounded-full mr-3"
      />
      <div className="w-full">
        <div>
          <div className="flex items-center text-sm mb-4 border border-gray-500 rounded-full px-2 cursor-not-allowed w-24 justify-center">
            <p className="font-bold">Everyone</p>
            <IoIosArrowDown />
          </div>
          <input
            value={input}
            className=" bg-black outline-none text-white pt-3 pb-5 w-full"
            placeholder="What's happening?"
            onChange={handleChange}
          />
          <div className="flex justify-between">
            <div className="flex items-center gap-1 mb-1 cursor-not-allowed">
              <BsGlobe2 className="text-xs" />
              <p className="font-bold text-sm">Everyone can reply</p>
            </div>
            <p className="text-sm font-light">{inputLength} / 140</p>
          </div>
        </div>
        <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        <div className="flex justify-between">
          <div className="flex text-xl gap-3 justify-between items-center z-1">
            <RxImage />
            <AiOutlineGif className="opacity-40 cursor-not-allowed" />
            <AiOutlineSmile className="opacity-40 cursor-not-allowed" />
            <TbListDetails className="opacity-40 cursor-not-allowed" />
            <AiOutlineCalendar className="opacity-40 cursor-not-allowed" />
            <TfiLocationPin className="opacity-40 cursor-not-allowed" />
          </div>
          <button
            disabled={inputLength < 1}
            onClick={handleTweet}
            className="font-bold text-white disabled:bg-blue-900 disabled:text-gray-300 bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-full text-sm px-5 py-1.5 text-center"
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}
