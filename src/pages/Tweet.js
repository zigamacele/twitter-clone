import React, { useState } from 'react';
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

    setInput('');
    setInputLength(0);
  }

  return (
    <div className="flex">
      <img
        src={currentUser.profilePicURL}
        alt="profile-picture"
        className="h-10 rounded-3xl"
      />
      <div>
        <div>
          <div className="flex">
            <p>Everyone</p>
            <IoIosArrowDown />
          </div>
          <input
            value={input}
            className="border"
            placeholder="What's happening?"
            onChange={handleChange}
          />
          <div className="flex">
            <BsGlobe2 />
            <p>Everyone can reply</p>
            <p>{inputLength} / 140</p>
          </div>
          <hr />
        </div>
        <div className="flex justify-between">
          <div className="flex">
            <RxImage />
            <AiOutlineGif />
            <AiOutlineSmile />
            <TbListDetails />
            <AiOutlineCalendar />
            <TfiLocationPin />
          </div>
          <button onClick={handleTweet}>Tweet</button>
        </div>
      </div>
    </div>
  );
}
