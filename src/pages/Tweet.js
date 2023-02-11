import React, { useState } from 'react';
import { db } from './firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { router } from 'next/router';

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

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const pullCurrentUser = onSnapshot(
        doc(db, 'users', getAuth().currentUser.uid),
        (doc) => {
          setCurrentUser(doc.data());
        }
      );
    } else {
      router.push('/login');
    }
  });

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
          <input className="border" placeholder="What's happening?" />
          <div className="flex">
            <BsGlobe2 />
            <p>Everyone can reply</p>
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
          <button>Tweet</button>
        </div>
      </div>
    </div>
  );
}
