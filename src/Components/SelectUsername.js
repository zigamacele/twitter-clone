import React, { useEffect, useState } from 'react';
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

export default function SelectUsername() {
  const [inputValue, setInputValue] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    setCurrentUser(getAuth().currentUser);
  }, []);

  function generateUsername(name) {
    const randomNumber = Math.floor(Math.random() * 900) + 1;
    const newName = name.replace(/\s/g, '') + '-' + randomNumber;
    console.log(newName);
    return newName;
  }

  function handleSetUsername() {
    setDoc(doc(getFirestore(), 'users', `${currentUser.uid}`), {
      name: currentUser.displayName,
      username: generateUsername(currentUser.displayName),
      profilePicUrl: currentUser.photoURL,
    });
  }

  function handleChange(e) {
    setInputValue(e.target.value);
    console.log(inputValue);
  }

  return (
    <div>
      <p>What should we call you?</p>
      <p>Your @username is unique. You can always change it later.</p>
      <input
        className="border"
        value={inputValue}
        onChange={(e) => {
          handleChange(e);
        }}
      ></input>
      <button onClick={handleSetUsername}>Set username</button>
      <button>Skip</button>
    </div>
  );
}
