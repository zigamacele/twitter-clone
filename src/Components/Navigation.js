import React, { useEffect, useState } from 'react';
import { router } from 'next/router';
import Image from 'next/image';
import { IconContext } from 'react-icons';
import LoadingScreen from '@/pages/LoadingScreen';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  pmit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/pages/firebase-config';
import { FiBookmark } from 'react-icons/fi';
import { BiUser, BiBell } from 'react-icons/bi';
import { AiOutlineHome } from 'react-icons/ai';
import { TbSearch, TbDotsCircleHorizontal, TbMail } from 'react-icons/tb';
import { BsCardChecklist } from 'react-icons/bs';
import { RiQuillPenLine } from 'react-icons/ri';

export default function Navigation() {
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState();
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
      {loading ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <LoadingScreen />
        </div>
      ) : null}
      <div>
        <div>
          <div>
            <AiOutlineHome />
            <p>Home</p>
          </div>
          <div className="cursor-not-allowed">
            <TbSearch />
            <p>Explore</p>
          </div>
          <div className="cursor-not-allowed">
            <BiBell />
            <p>Notification</p>
          </div>
          <div className="cursor-not-allowed">
            <TbMail />
            <p>Messages</p>
          </div>
          <div>
            <FiBookmark />
            <p>Bookmarks</p>
          </div>
          <div className="cursor-not-allowed">
            <BsCardChecklist />
            <p>Lists</p>
          </div>
          <div>
            <BiUser />
            <p>Profile</p>
          </div>
          <div>
            <TbDotsCircleHorizontal />
            <p>More</p>
          </div>
          <div>
            <RiQuillPenLine />
            <button>Tweet</button>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <div>
            <img
              src={currentUser.profilePicURL}
              alt="profile-picture"
              className="w-10 h-10"
            />
          </div>
          <div className="flex flex-col">
            <p>{currentUser.displayName}</p>
            <p>@{currentUser.username}</p>
          </div>
        </div>
        <p
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              signOut(auth);
              router.push('/login');
            }, 2000);
          }}
        >
          ...
        </p>
      </div>
    </div>
  );
}
