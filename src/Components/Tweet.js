import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../pages/firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter, router } from 'next/router';
import {
  onSnapshot,
  addDoc,
  doc,
  collection,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';

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

export default function Tweet({ reload, setReload }) {
  const [currentUser, setCurrentUser] = useState('');
  const [input, setInput] = useState('');
  const [inputImage, setInputImage] = useState(null);
  const [inputLength, setInputLength] = useState(0);
  const router = useRouter();
  const tweetID = router.query.tweet;
  const auth = getAuth();

  //!!REMOVE THIS??
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
    if (inputImage !== null) {
      const randomNumber = Math.floor(Math.random() * 900) + 1;
      const file = inputImage;
      console.log(file);
      const localfileBlob = URL.createObjectURL(file);
      const storage = getStorage();
      const storageRef = ref(storage, `${randomNumber}-${file.name}`);

      uploadBytes(storageRef, file);

      const fileSnapshot = await uploadBytesResumable(
        storageRef,
        localfileBlob
      );
      console.log(fileSnapshot.metadata.fullPath);
      const imageDownloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'all-tweets'), {
        userID: getAuth().currentUser.uid,
        message: input,
        timestamp: serverTimestamp(),
        imageURL: imageDownloadURL.toString(),
        likes: 0,
        liked: [],
        bookmarked: [],
        replied: tweetID !== undefined ? tweetID : null,
      }).then(async function (docRef) {
        const updateRef = doc(db, 'all-tweets', docRef.id);
        await updateDoc(updateRef, {
          id: docRef.id,
        });
      });

      setInputImage(null);
      setInput('');
      setInputLength(0);
      setReload(!reload);

      return;
    }

    await addDoc(collection(db, 'all-tweets'), {
      userID: getAuth().currentUser.uid,
      message: input,
      timestamp: serverTimestamp(),
      likes: 0,
      liked: [],
      bookmarked: [],
      replied: tweetID !== undefined ? tweetID : null,
    }).then(async function (docRef) {
      const updateRef = doc(db, 'all-tweets', docRef.id);
      await updateDoc(updateRef, {
        id: docRef.id,
      });
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
    setReload(!reload);
  }

  async function handleImageUpload(file) {
    setInputImage(file);
  }

  return (
    <div className="flex  border-gray-800 p-3 text-blue-500 w-[35em] justify-start">
      <img
        src={currentUser.profilePicURL}
        alt="profile-picture"
        className="h-10 rounded-full mr-3"
      />
      <div className="w-full">
        <div>
          <div className="flex items-center text-sm mb-4 border  border-gray-500 rounded-full px-2 cursor-not-allowed w-24 justify-center">
            <p className="font-bold">Everyone</p>
            <IoIosArrowDown />
          </div>
          <input
            value={input}
            className=" bg-black text-white outline-none pt-1 pb-5 w-full placeholder:text-xl placeholder:text-gray-500"
            placeholder="What's happening?"
            onChange={handleChange}
          />
          {!inputImage ? null : (
            <img
              alt="uploaded-image-preview"
              src={URL.createObjectURL(inputImage)}
              className="rounded mb-2 mx-h-80 cursor-pointer"
              onClick={() => setInputImage(null)}
            />
          )}
          <div className="flex justify-between">
            <div className="flex items-center gap-1 mb-1 cursor-not-allowed">
              <BsGlobe2 className="text-xs" />
              <p className="font-bold text-sm">Everyone can reply</p>
            </div>
            <p className="text-sm font-light">{inputLength} / 140</p>
          </div>
        </div>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        <div className="flex justify-between">
          <div className="flex text-xl gap-3 justify-between items-center z-1 ">
            <label className="cursor-pointer">
              <RxImage />
              <input
                type="file"
                name="myfile"
                className="hidden"
                onChange={(e) => setInputImage(e.target.files[0])}
              />
            </label>
            <AiOutlineGif className="cursor-not-allowed text-blue-900" />
            <AiOutlineSmile className="cursor-not-allowed text-blue-900" />
            <TbListDetails className="cursor-not-allowed text-blue-900" />
            <AiOutlineCalendar className="cursor-not-allowed text-blue-900" />
            <TfiLocationPin className="cursor-not-allowed text-blue-900" />
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
