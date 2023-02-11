import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { router } from 'next/router';

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getDoc,
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/pages/firebase-config';
import Logo from '@/images/twitter-logo-white.png';
import Image from 'next/image';

export default function SelectUsername() {
  const [inputValue, setInputValue] = useState('');
  const [newUser, setNewUser] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  async function handleSetUsername() {
    const uniqueUsernames = [];
    const userRef = collection(db, 'users');
    const querySnapshot = await getDocs(userRef);
    querySnapshot.forEach((doc) => {
      uniqueUsernames.push(doc.data().username);
    });

    const docRef = doc(db, 'users', getAuth().currentUser.uid);
    if (uniqueUsernames.includes(inputValue)) return toast('Username taken');
    if (inputValue.length > 2)
      await updateDoc(docRef, {
        username: inputValue,
      });

    handleSkip();
  }

  async function handleSkip() {
    const docRef = doc(db, 'users', getAuth().currentUser.uid);
    await updateDoc(docRef, {
      newUser: false,
    });
    setNewUser(false);
  }

  function handleChange(e) {
    setInputValue(e.target.value);
  }

  if (user) {
    const newUserStatus = onSnapshot(
      doc(db, 'users', getAuth().currentUser.uid),
      (doc) => {
        setNewUser(doc.data().newUser);
      }
    );
  }

  return (
    <div>
      {newUser ? (
        <div className="absolute w-screen h-screen bg-gray-700 bg-opacity-80">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center bg-black  p-10 rounded-xl gap-1 text-white">
            <Image src={Logo} className="w-8 self-center mb-5" alt="logo" />
            <p className="text-3xl font-bold mb-1">What should we call you?</p>
            <p className="text-gray-500 mb-5 text-sm">
              Your @username is unique. You can always change it later.
            </p>
            <input
              value={inputValue}
              onChange={(e) => {
                handleChange(e);
              }}
              className="bg-black border text-gray-500 border-gray-700 px-2 py-3 rounded mb-48"
              placeholder="Username"
            />
            <button
              className="w-full text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm px-5 py-1.5 text-center dark:bg-white cursor-pointer"
              onClick={() => {
                if (inputValue.length < 3)
                  toast.info('Username too short!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                  });
                else handleSetUsername();
              }}
            >
              Set username
            </button>
            <button
              onClick={handleSkip}
              className="mt-2 w-full text-white  hover:bg-gray-800 hover:bg-opacity-30 focus:ring-4 focus:outline-none focus:ring-blue-300 border border-white font-medium rounded-3xl text-sm px-5 py-1.5 text-center "
            >
              Skip
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
