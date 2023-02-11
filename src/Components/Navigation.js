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
import {
  HiHome,
  HiOutpneDotsCircleHorizontal,
  HiOutlineSearch,
} from 'react-icons/hi';
import { FiBookmark } from 'react-icons/fi';
import { RiFilepst2pne } from 'react-icons/ri';
import { BiUser, BiBell } from 'react-icons/bi';
import { IoMailOutline } from 'react-icons/io';
import { firebaseConfig } from '@/pages/firebase-config';

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
    } else {
      router.push('/login');
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
            <p>Home</p>
          </div>
          <div>
            <p className="cursor-not-allowed">Explore</p>
          </div>
          <div>
            <p className="cursor-not-allowed">Notification</p>
          </div>
          <div>
            <p className="cursor-not-allowed">Messages</p>
          </div>
          <div>
            <p>Bookmarks</p>
          </div>
          <div>
            <p className="cursor-not-allowed">Lists</p>
          </div>
          <div>
            <p>Profile</p>
          </div>
          <div>
            <p className="cursor-not-allowed">More</p>
          </div>
        </div>
        <button>Tweet</button>
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
            }, 2000);
          }}
        >
          ...
        </p>
      </div>
    </div>
  );
}
