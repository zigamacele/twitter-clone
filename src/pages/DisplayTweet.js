import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebase-config';

import { FaRegComment, FaRegHeart, FaRetweet } from 'react-icons/fa';
import { MdIosShare } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';

export default function DisplayTweet({ tweet }) {
  const [tweetOwner, setTweetOwner] = useState('');

  useEffect(() => {
    getDisplayName(tweet.userID);
  }, []);

  useEffect(() => {
    getDisplayName(tweet.userID);
  }, [tweet]);

  async function getDisplayName(userID) {
    let tweetID;
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
      if (userID === doc.id)
        setTweetOwner({
          displayName: doc.data().displayName,
          username: doc.data().username,
          profilePicURL: doc.data().profilePicURL,
        });
    });

    return tweetID;
  }
  return (
    <div className="flex border border-gray-800 px-3 py-3 w-[30em]">
      <img
        src={tweetOwner.profilePicURL}
        alt="profile-picture"
        className="rounded rounded-full h-10 mr-3"
      />
      <div className="flex flex-col w-full">
        <div className="flex">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-1">
              <p className="font-bold">{tweetOwner.displayName}</p>
              <p className="text-gray-400">@{tweetOwner.username}</p>
            </div>
            <div>
              <BsThreeDots />
            </div>
          </div>
        </div>
        <p className="pt-1 pb-2">{tweet.message}</p>
        <div className="flex gap-2 text-gray-400 text-sm mb-1">
          <p>{tweet.timestamp.toDate().toLocaleTimeString()}</p>
          <p>{tweet.timestamp.toDate().toDateString()}</p>
        </div>
        <div className="flex text-gray-400 gap-10">
          <div className="flex justify-center items-center gap-4">
            <FaRegComment />
            <p>0</p>
          </div>
          <div className="flex justify-center items-center gap-4">
            <FaRetweet />
            <p>0</p>
          </div>
          <div className="flex justify-center items-center gap-4">
            <FaRegHeart />
            <p>?</p>
          </div>
          <div className="flex justify-center items-center gap-4">
            <MdIosShare />
          </div>
        </div>
      </div>
    </div>
  );
}
