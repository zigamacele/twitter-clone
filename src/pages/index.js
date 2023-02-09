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
  getDocs,
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

import { useState } from 'react';
import Logo from '../images/twitter-logo.webp';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { db } from './firebase-config';

function generateUsername(name) {
  const randomNumber = Math.floor(Math.random() * 900) + 1;
  const newName = name.replace(/\s/g, '') + '-' + randomNumber;
  return newName;
}

function LoadingScreen() {
  return (
    <div className="bg-black w-screen h-screen flex items-center justify-center">
      <Image
        src={Logo}
        alt="twitter-logo"
        className="object-sacle-down h-16 w-auto"
      />
    </div>
  );
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  // const [currentUser, setCurrentUser] = useState('');
  const router = useRouter();

  async function handleSignIn() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);

    const userIDs = [];
    const querySnapshot = await getDocs(collection(db, 'users'));
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      userIDs.push(doc.id);
    });

    if (!userIDs.includes(getAuth().currentUser.uid)) {
      await setDoc(
        doc(getFirestore(), 'users', `${getAuth().currentUser.uid}`),
        {
          name: getAuth().currentUser.displayName,
          username: generateUsername(getAuth().currentUser.displayName),
          profilePicUrl: getAuth().currentUser.photoURL,
        }
      );
    }

    // setIsLoading(true);
    // setTimeout(() => {
    //   router.push('/Home');
    // }, 2000);
  }

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <button onClick={handleSignIn}>Login</button>
      )}
    </div>
  );
}
