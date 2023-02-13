import React, { useEffect, useState } from 'react';
import { router } from 'next/router';
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../pages/firebase-config';
import { getAuth } from 'firebase/auth';
import { Popover, Transition } from '@headlessui/react';

import { FaRegComment, FaHeart, FaRegHeart, FaRetweet } from 'react-icons/fa';
import { MdIosShare } from 'react-icons/md';
import { BsThreeDots, BsBookmarkCheck, BsBookmarkDash } from 'react-icons/bs';
import { BiUserPlus } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';

export default function DisplayTweet({ tweet, reload, setReload }) {
  const [tweetOwner, setTweetOwner] = useState('');
  const auth = getAuth();

  useEffect(() => {
    getDisplayName(tweet.userID, tweet);
  }, []);

  useEffect(() => {
    getDisplayName(tweet.userID, tweet);
  }, [tweet]);

  async function getDisplayName(userID, tweet) {
    let tweetID;
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
      if (userID === doc.id)
        if (tweet.imageURL) {
          setTweetOwner({
            displayName: doc.data().displayName,
            username: doc.data().username,
            profilePicURL: doc.data().profilePicURL,
            imageURL: tweet.imageURL,
          });
        } else {
          setTweetOwner({
            displayName: doc.data().displayName,
            username: doc.data().username,
            profilePicURL: doc.data().profilePicURL,
          });
        }
    });
    return tweetID;
  }

  async function handleLike() {
    const updateRef = doc(db, 'all-tweets', tweet.id);

    const tweetAddUID = [...tweet.liked, getAuth().currentUser.uid];
    const tweetRemoveUID = tweet.liked.filter(
      (tweet) => tweet !== getAuth().currentUser.uid
    );

    if (!tweet.liked.includes(getAuth().currentUser.uid)) {
      await updateDoc(updateRef, {
        likes: tweet.likes + 1,
        liked: tweetAddUID,
      });
    } else {
      await updateDoc(updateRef, {
        likes: tweet.likes - 1,
        liked: tweetRemoveUID,
      });
    }

    setReload(!reload);
  }

  async function handleBookmark() {
    const updateRef = doc(db, 'all-tweets', tweet.id);

    const tweetAddUID = [...tweet.bookmarked, getAuth().currentUser.uid];
    const tweetRemoveUID = tweet.bookmarked.filter(
      (tweet) => tweet !== getAuth().currentUser.uid
    );

    if (!tweet.bookmarked.includes(getAuth().currentUser.uid)) {
      await updateDoc(updateRef, {
        bookmarked: tweetAddUID,
      });
    } else {
      await updateDoc(updateRef, {
        bookmarked: tweetRemoveUID,
      });
    }

    setReload(!reload);
  }

  async function handleDelete() {
    const tweetID = tweet.id;
    await deleteDoc(doc(db, 'all-tweets', tweetID));
    setReload(!reload);
  }

  return (
    <div
      onClick={() => {
        router.push(`/tweet/${tweet.id}`);
      }}
      className="flex border border-gray-800 px-3 py-3 w-[35em] cursor-pointer hover:bg-gray-900"
    >
      <img
        src={tweetOwner.profilePicURL}
        alt="profile-picture"
        className="rounded rounded-full h-10 mr-3"
      />
      <div className="flex flex-col w-full">
        <div className="flex">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-1 items-center">
              <p className="font-bold">{tweetOwner.displayName}</p>
              <p className="text-gray-400">@{tweetOwner.username}</p>
            </div>
            <div>
              <Popover>
                <Popover.Button>
                  <BsThreeDots />
                </Popover.Button>
                <Popover.Panel className="absolute flex flex-col z-50 bg-black rounded-xl shadow-3xl  ">
                  {tweet.userID === auth.currentUser.uid ? null : (
                    <div className="flex items-center gap-1 font-bold hover:bg-gray-800 pl-4 pr-10 pt-2 cursor-pointer">
                      <BiUserPlus className="text-xl" />
                      <p className="">Follow {tweetOwner.displayName}</p>
                    </div>
                  )}
                  {!tweet.bookmarked.includes(getAuth().currentUser.uid) ? (
                    <div
                      onClick={handleBookmark}
                      className="flex items-center gap-2 font-bold my-1 pl-4 pr-10 hover:bg-gray-800 pt-1 pb-1 cursor-pointer"
                    >
                      <BsBookmarkCheck />
                      <p>Bookmark</p>
                    </div>
                  ) : (
                    <div
                      onClick={handleBookmark}
                      className="flex items-center gap-2 font-bold pl-4 pr-10 hover:bg-gray-800 pt-1 pb-1 cursor-pointer"
                    >
                      <BsBookmarkDash />
                      <p>Remove Bookmark</p>
                    </div>
                  )}
                  {tweet.userID !== auth.currentUser.uid ? null : (
                    <div
                      onClick={handleDelete}
                      className="flex items-center gap-2 font-bold pl-4 pr-10 pb-2 hover:bg-gray-800 pt-1 cursor-pointer"
                    >
                      <AiOutlineDelete />
                      <p>Delete</p>
                    </div>
                  )}
                </Popover.Panel>
              </Popover>
            </div>
          </div>
        </div>
        <p className="pt-1 pb-2">{tweet.message}</p>
        {!tweetOwner.imageURL ? null : (
          <Popover>
            <Popover.Button>
              <img
                src={tweetOwner.imageURL}
                className="h-m-80"
                className="rounded-2xl mb-2 mr-1"
              />
            </Popover.Button>
            <Popover.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-80" />
            <Popover.Panel>
              <img
                src={tweetOwner.imageURL}
                className="h-m-80"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl mb-2 mr-1 max-w-[45em]"
              />
            </Popover.Panel>
          </Popover>
        )}
        <div className="flex gap-2 text-gray-400 text-sm mb-1">
          <p>{tweet.timestamp.toDate().toLocaleTimeString()}</p>
          <p>{tweet.timestamp.toDate().toDateString()}</p>
        </div>
        <div className="flex text-gray-400 gap-10">
          <div className="flex justify-center items-center gap-3 hover:text-blue-400">
            <FaRegComment />
            <p>0</p>
          </div>
          <div className="flex justify-center items-center gap-3 cursor-not-allowed text-gray-600">
            <FaRetweet />
            <p>0</p>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="flex justify-center items-center gap-3 hover:text-red-500"
          >
            {tweet.liked.includes(getAuth().currentUser.uid) ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart onClick={handleLike} />
            )}
            <p>{tweet.likes}</p>
          </div>
          <div className="flex justify-center items-center gap-4 cursor-not-allowed text-gray-600">
            <MdIosShare />
          </div>
        </div>
      </div>
    </div>
  );
}
