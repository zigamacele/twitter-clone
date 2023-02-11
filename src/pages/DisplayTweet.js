import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebase-config';

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
    <div className="flex">
      <img
        src={tweetOwner.profilePicURL}
        alt="profile-picture"
        className="rounded rounded-full h-10"
      />
      <div className="flex flex-col">
        <div className="flex">
          <div className="flex">
            <p>{tweetOwner.displayName}</p>
            <p>@{tweetOwner.username}</p>
            <div className="flex">
              <p>{tweet.timestamp.toDate().toLocaleTimeString()}</p>
              <p>{tweet.timestamp.toDate().toDateString()}</p>
            </div>
          </div>
        </div>
        <p>{tweet.message}</p>
        <div></div>
      </div>
    </div>
  );
}

//TIMESTAMP
//https://stackoverflow.com/questions/52247445/how-do-i-convert-a-firestore-date-timestamp-to-a-js-date
