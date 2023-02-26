import { db } from '@/firebase-config';
import { getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  documentId,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DisplayTweet from './DisplayTweet';

export default function AllTweets({
  reload,
  setReload,
  index,
  setIndex,
  tweetID,
  replies,
  username,
}) {
  const [allTweets, setAllTweets] = useState([]);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    fetchAllTweets();
  }, []);

  useEffect(() => {
    fetchAllTweets();
  }, [router.query]);

  useEffect(() => {
    fetchAllTweets();
  }, [reload, tweetID, index]);

  async function fetchAllTweets() {
    let q;
    const allTweetsRef = collection(db, 'all-tweets');

    try {
      if (tweetID !== undefined) {
        setIndex('');
        q = query(allTweetsRef, where(documentId(), '==', tweetID));
        if (replies === true)
          q = query(
            allTweetsRef,
            where('replied', '==', tweetID),
            orderBy('timestamp', 'desc')
          );
      } else {
        if (index === 'Home')
          q = query(
            allTweetsRef,
            where('replied', '==', null),
            orderBy('timestamp', 'desc')
          );
        if (index === 'Bookmarks')
          q = query(
            allTweetsRef,
            where('bookmarked', 'array-contains', auth.currentUser.uid)
          );
        if (index === 'userTweets') {
          const userIDs = [];
          const usersRef = collection(db, 'users');
          const queryUsername = query(
            usersRef,
            where('username', '==', username)
          );
          const querySnapshot = await getDocs(queryUsername);
          querySnapshot.forEach((doc) => {
            userIDs.push(doc.data());
          });

          q = query(
            allTweetsRef,
            where('userID', '==', userIDs[0].uid),
            where('replied', '==', null),
            orderBy('timestamp', 'desc')
          );
        }
        if (index === 'userReplies') {
          const userIDs = [];
          const usersRef = collection(db, 'users');
          const queryUsername = query(
            usersRef,
            where('username', '==', username)
          );
          const querySnapshot = await getDocs(queryUsername);
          querySnapshot.forEach((doc) => {
            userIDs.push(doc.data());
          });

          q = query(
            allTweetsRef,
            where('userID', '==', userIDs[0].uid),
            orderBy('timestamp', 'desc')
          );
        }
        if (index === 'userMedia') {
          const userIDs = [];
          const usersRef = collection(db, 'users');
          const queryUsername = query(
            usersRef,
            where('username', '==', username)
          );
          const querySnapshot = await getDocs(queryUsername);
          querySnapshot.forEach((doc) => {
            userIDs.push(doc.data());
          });

          q = query(
            allTweetsRef,
            where('userID', '==', userIDs[0].uid),
            where('mediaTweet', '==', true),
            orderBy('timestamp', 'desc')
          );
        }
        if (index === 'userLikes') {
          const userIDs = [];
          const usersRef = collection(db, 'users');
          const queryUsername = query(
            usersRef,
            where('username', '==', username)
          );
          const querySnapshot = await getDocs(queryUsername);
          querySnapshot.forEach((doc) => {
            userIDs.push(doc.data());
          });

          q = query(
            allTweetsRef,
            where('liked', 'array-contains', userIDs[0].uid)
          );
        }
      }

      const snapshot = await getDocs(q);
      const arrayOfTweets = [];
      snapshot.forEach((doc) => arrayOfTweets.push(doc.data()));

      setAllTweets(arrayOfTweets);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex flex-col">
      {allTweets.map((tweet) => {
        return (
          <DisplayTweet
            key={tweet.id}
            tweet={tweet}
            reload={reload}
            setReload={setReload}
            setIndex={setIndex}
          />
        );
      })}
    </div>
  );
}
