import React, { useEffect, useState } from 'react';
import { db } from './firebase-config';
import {
  collection,
  getDocs,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import DisplayTweet from './DisplayTweet';

export default function AllTweets() {
  const [allTweets, setAllTweets] = useState([]);

  useEffect(() => {
    fetchAllTweets();
  }, []);

  async function fetchAllTweets() {
    const q = query(collection(db, 'all-tweets'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const arrayOfTweets = [];
    snapshot.forEach((doc) => arrayOfTweets.push(doc.data()));

    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     if (change.type === 'added') {
    //       console.log('added: ', change.doc.data());
    //     }
    //     if (change.type === 'modified') {
    //       console.log('Modified : ', change.doc.data());
    //     }
    //     if (change.type === 'removed') {
    //       console.log('Removed : ', change.doc.data());
    //     }
    //   });
    // });

    setAllTweets(arrayOfTweets);
  }

  return (
    <div className="flex flex-col">
      <button
        className="py-3 border border-gray-800 text-blue-500"
        onClick={() => {
          fetchAllTweets();
        }}
      >
        Show new Tweets
      </button>
      {allTweets.map((tweet) => {
        return <DisplayTweet tweet={tweet} />;
      })}
    </div>
  );
}
