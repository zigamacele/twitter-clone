import { db } from '@/firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { AiOutlineLink } from 'react-icons/ai';
import { VscArrowLeft } from 'react-icons/vsc';

export default function Following({ reload, setReload, index, setIndex }) {
  const [user, setUser] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const router = useRouter();
  const username = router.query.username;
  const profilePath = router.query.following;

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  async function fetchUser() {
    const usersRef = collection(db, 'users');
    const currentUserQuery = query(usersRef, where('username', '==', username));
    const docSnap = await getDocs(currentUserQuery);
    docSnap.forEach((doc) => {
      setUser(doc.data().uid);
    });
    console.log(user);
  }

  async function fetchProfiles() {
    const usersRef = collection(db, 'users');

    let q;
    if (profilePath === 'following')
      q = query(usersRef, where('followers', 'array-contains', user));
    else q = query(usersRef, where('following', 'array-contains', user));

    const usersArray = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      usersArray.push(doc.data());
    });
    setProfiles(usersArray);
    console.log(usersArray);

    console.log(profiles);
  }

  return (
    <div className="flex flex-col justify-start border border-gray-800 h-screen">
      <div className="flex flex-col border border-gray-800 w-[35em]">
        <div className="flex items-center">
          <VscArrowLeft
            className="text-xl ml-4 mr-6 cursor-pointer"
            onClick={() => {
              router.push(`/user/${username}`);
              setIndex('userTweets');
            }}
          />
          <p className="sticky top-0 backdrop-blur py-5 px-3 font-bold text-xl  ">
            {profilePath === 'following' ? 'Following' : 'Followers'}
          </p>
        </div>
      </div>
      <div className="flex flex-col scrollbar-hide mt-4 gap-3">
        {profiles.map((profile) => {
          return (
            <div
              key={profile.username}
              onClick={() => router.push(`/user/${profile.username}`)}
              className="flex h-20 ml-3 cursor-pointer p-1"
            >
              <img
                src={profile.profilePicURL}
                className="rounded-full h-12 w-12 content-center object-cover hover:opacity-80"
              />
              <div>
                <div className="ml-4">
                  <p className="font-bold hover:underline">
                    {profile.displayName}
                  </p>
                  <p className="text-gray-400 font-light">
                    @{profile.username}
                  </p>
                  <p className="break-all">{profile.bio}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
