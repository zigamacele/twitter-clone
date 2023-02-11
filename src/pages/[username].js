import { useRouter } from 'next/router';
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
  getDocs,
  collection,
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
import React, { useEffect, useState } from 'react';
import { db } from '@/pages/firebase-config';

//!! IF getAuth current user === profile => show edit button
export default function Profile() {
  const [profile, setProfile] = useState('');
  const router = useRouter();
  const username = router.query.username;

  async function findUsername() {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('username', '==', `${username}`));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setProfile(doc.data());
    });
  }
  findUsername();

  return (
    <div>
      <img src={profile.profilePicURL} />
      {profile.displayName} @{profile.username}
    </div>
  );
}
