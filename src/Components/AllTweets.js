import React, { useEffect, useState } from 'react';
import { db } from '@/pages/firebase-config';
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  documentId,
  doc,
  Timestamp,
} from 'firebase/firestore';
import DisplayTweet from './DisplayTweet';
import { getAuth } from 'firebase/auth';

export default function AllTweets({
  reload,
  setReload,
  index,
  setIndex,
  tweetID,
  replies,
}) {
  const [allTweets, setAllTweets] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    fetchAllTweets();
  }, []);

  useEffect(() => {
    fetchAllTweets();
  }, [reload, tweetID]);

  async function fetchAllTweets() {
    let q;
    const allTweetsRef = collection(db, 'all-tweets');

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
        q = query(allTweetsRef, orderBy('timestamp', 'desc'));
      if (index === 'Bookmarks')
        q = query(
          allTweetsRef,
          where('bookmarked', 'array-contains', auth.currentUser.uid)
        );
    }

    const snapshot = await getDocs(q);
    const arrayOfTweets = [];
    snapshot.forEach((doc) => arrayOfTweets.push(doc.data()));

    setAllTweets(arrayOfTweets);
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
          />
        );
      })}
    </div>
  );
}
