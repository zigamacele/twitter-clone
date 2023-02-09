import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

export default function Navigation() {
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    setCurrentUser(getAuth().currentUser);
  }, []);

  return (
    <div>
      <ul>
        <li>Home</li>
        <li>Explore</li>
        <li>Notification</li>
        <li>Messages</li>
        <li>Bookmarks</li>
        <li>List</li>
        <li>Profile</li>
        <li>More</li>
      </ul>
      <div className="flex">
        <img
          src={currentUser.photoURL}
          alt="profile-picture"
          className="w-10"
        />
        <p>{currentUser.displayName}</p>
        <p>@{currentUser.username}</p>
      </div>
    </div>
  );
}
