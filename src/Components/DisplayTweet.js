import { Popover } from '@headlessui/react';
import { getAuth } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { router } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Animate } from 'react-simple-animate';
import { db } from '../firebase-config';

import { AiOutlineDelete } from 'react-icons/ai';
import { BiUserPlus } from 'react-icons/bi';
import { BsBookmarkCheck, BsBookmarkDash, BsThreeDots } from 'react-icons/bs';
import { FaHeart, FaRegComment, FaRegHeart, FaRetweet } from 'react-icons/fa';
import { MdIosShare } from 'react-icons/md';

export default function DisplayTweet({ tweet, reload, setReload, setIndex }) {
  const [tweetOwner, setTweetOwner] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const auth = getAuth();

  useEffect(() => {
    getDisplayName(tweet.userID, tweet);
    handleCommentCount();
  }, []);

  useEffect(() => {
    getDisplayName(tweet.userID, tweet);
    handleCommentCount();
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

  async function handleCommentCount() {
    const repliedComments = [];
    const allTweets = collection(db, 'all-tweets');

    const querySnapshot = await getDocs(allTweets);
    querySnapshot.forEach((doc) => {
      if (tweet.id === doc.data().replied) {
        repliedComments.push(doc.data().id);
      }
    });
    setCommentCount(repliedComments.length);
  }

  return (
    <div
      onClick={() => {
        router.push(`/tweet/${tweet.id}`);
      }}
      className="flex border border-gray-800 px-3 py-3 w-[35em] cursor-pointer hover:bg-gray-900/30"
    >
      <img
        src={tweetOwner.profilePicURL}
        alt="profile-picture"
        className="rounded rounded-full h-10 w-10 object-cover mr-3 hover:opacity-80"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/user/${tweetOwner.username}`);
        }}
      />
      <div className="flex flex-col w-full">
        <div className="flex">
          <div className="w-full flex justify-between items-center">
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/user/${tweetOwner.username}`);
              }}
              className="flex gap-1 items-center"
            >
              <p className="font-bold hover:underline">
                {tweetOwner.displayName}
              </p>
              <p className="text-gray-400">@{tweetOwner.username}</p>
            </div>
            <div className="relative">
              <Popover onClick={(e) => e.stopPropagation()}>
                <Popover.Button>
                  <BsThreeDots />
                </Popover.Button>
                <Popover.Panel className="absolute flex flex-col right-10 bottom-8 right-[-3px] bg-black rounded-xl shadow-3xl w-60 p-3 gap-2">
                  <Animate play start={{ opacity: 0 }} end={{ opacity: 1 }}>
                    {!tweet.bookmarked.includes(getAuth().currentUser.uid) ? (
                      <div
                        onClick={handleBookmark}
                        className="flex items-center gap-2 font-light cursor-pointer hover:font-bold"
                      >
                        <BsBookmarkCheck />
                        <p>Bookmark</p>
                      </div>
                    ) : (
                      <div
                        onClick={handleBookmark}
                        className="flex items-center gap-2 font-light cursor-pointer hover:font-bold"
                      >
                        <BsBookmarkDash />
                        <p>Remove Bookmark</p>
                      </div>
                    )}
                    {tweet.userID !== auth.currentUser.uid ? null : (
                      <div
                        onClick={handleDelete}
                        className="flex items-center gap-2 font-light cursor-pointer hover:font-bold"
                      >
                        <AiOutlineDelete />
                        <p>Delete</p>
                      </div>
                    )}
                  </Animate>
                </Popover.Panel>
              </Popover>
            </div>
          </div>
        </div>
        <p className="pt-1 pb-2 break-all">{tweet.message}</p>
        {!tweetOwner.imageURL ? null : (
          <Popover>
            <Popover.Button>
              <img
                src={tweetOwner.imageURL}
                className="rounded-2xl mb-2 mr-1 h-max-80"
              />
            </Popover.Button>
            <Popover.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-80 z-50" />
            <Popover.Panel>
              <Animate play start={{ opacity: 0 }} end={{ opacity: 1 }}>
                <img
                  src={tweetOwner.imageURL}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl mb-2 mr-1 max-w-[45em] z-50 h-max-80"
                />
              </Animate>
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
            <p>{commentCount}</p>
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
