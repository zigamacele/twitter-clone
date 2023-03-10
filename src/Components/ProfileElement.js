import { db } from '@/firebase-config';
import { Popover } from '@headlessui/react';
import { getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Animate } from 'react-simple-animate';
import BeatLoader from 'react-spinners/BeatLoader';

import { AiOutlineLink } from 'react-icons/ai';
import { BsGear } from 'react-icons/bs';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import { RiCloseLine } from 'react-icons/ri';

export default function ProfileElement({ reload, setReload, index, setIndex }) {
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(false);
  const [follow, setFollow] = useState('Follow');
  const [currentUser, setCurrentUser] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [inputImage, setInputImage] = useState(null);
  const [inputBanner, setInputBanner] = useState(null);

  const auth = getAuth();
  const router = useRouter();
  const username = router.query.username;

  useEffect(() => {
    findUsername();
    setIndex('userTweets');
  }, [router]);

  useEffect(() => {
    findUsername();
    console.log(index);
  }, [index]);

  useEffect(() => {
    findUsername();
  }, [reload]);

  async function getCurrentUser() {
    const currentUserRef = doc(db, 'users', getAuth().currentUser.uid);
    const docSnap = await getDoc(currentUserRef);
    setCurrentUser(docSnap.data());
  }

  async function findUsername() {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('username', '==', `${username}`));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setProfile(doc.data());
      setProfileName(doc.data().displayName);
      setProfileBio(doc.data().bio);
      setProfileLocation(doc.data().location);

      getCurrentUser();
      if (doc.data().followers.includes(getAuth().currentUser.uid))
        setFollow('Following');
      else setFollow('Follow');
    });
  }

  async function handleSave() {
    setLoading(true);
    const updateRef = doc(db, 'users', getAuth().currentUser.uid);

    if (inputImage !== null) {
      const randomNumber = Math.floor(Math.random() * 900) + 1;
      const file = inputImage;
      const localfileBlob = URL.createObjectURL(file);
      const storage = getStorage();
      const storageRef = ref(storage, `${randomNumber}-${file.name}`);

      uploadBytes(storageRef, file);
      const fileSnapshot = await uploadBytesResumable(
        storageRef,
        localfileBlob
      );
      const imageDownloadURL = await getDownloadURL(storageRef);

      await updateDoc(updateRef, {
        profilePicURL: imageDownloadURL,
      });
    }
    //
    if (inputBanner !== null) {
      const randomNumber = Math.floor(Math.random() * 900) + 1;
      const file = inputBanner;
      const localfileBlob = URL.createObjectURL(file);

      const storage = getStorage();
      const storageRef = ref(storage, `${randomNumber}-${file.name}`);

      uploadBytes(storageRef, file);
      const fileSnapshot = await uploadBytesResumable(
        storageRef,
        localfileBlob
      );
      const imageDownloadURL = await getDownloadURL(storageRef);

      await updateDoc(updateRef, {
        banner: imageDownloadURL,
      });
    }

    await updateDoc(updateRef, {
      displayName: profileName,
      location: profileLocation,
      bio: profileBio,
    });

    setLoading(false);
    findUsername();
    setInputBanner(null);
    setInputImage(null);
    setShowEditor(false);
  }

  async function handleFollow() {
    setLoading(true);

    //followers

    const followerRef = doc(db, 'users', profile.uid);

    const profileAddUID = [...profile.followers, getAuth().currentUser.uid];
    const profileRemoveUID = profile.followers.filter(
      (profile) => profile !== getAuth().currentUser.uid
    );

    if (!profile.followers.includes(getAuth().currentUser.uid)) {
      await updateDoc(followerRef, {
        followers: profileAddUID,
      });
    } else {
      await updateDoc(followerRef, {
        followers: profileRemoveUID,
      });
    }

    //following

    const followingRef = doc(db, 'users', getAuth().currentUser.uid);

    const addFollowingUID = [...currentUser.following, profile.uid];
    const removeFollowingUID = currentUser.following.filter(
      (p) => p !== profile.uid
    );

    if (!currentUser.following.includes(profile.uid)) {
      await updateDoc(followingRef, {
        following: addFollowingUID,
      });
    } else {
      await updateDoc(followingRef, {
        following: removeFollowingUID,
      });
    }

    setLoading(false);
    setReload(!reload);
    setIndex('userTweets');
  }

  return (
    <div>
      {!showEditor ? null : (
        <div
          onClick={() => {
            setProfileName(profile.displayName);
            setProfileBio(profile.bio);
            setProfileLocation(profile.location);
            setInputBanner(null);
            setInputImage(null);
            setShowEditor(false);
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-gray-700 bg-opacity-80 z-50"
        >
          <Animate play start={{ opacity: 0 }} end={{ opacity: 1 }}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-black pt-6 px-5 pb-10 rounded-xl w-[35em] h-[40em]"
            >
              <div className="flex justify-between">
                <div className="flex gap-8 text-xl items-center">
                  <RiCloseLine
                    className="text-2xl font-light cursor-pointer"
                    onClick={() => {
                      setProfileName(profile.displayName);
                      setProfileBio(profile.bio);
                      setProfileLocation(profile.location);
                      setInputBanner(null);
                      setInputImage(null);
                      setShowEditor(false);
                    }}
                  />
                  <p className="font-bold">Edit Profile</p>
                </div>
                <button
                  onClick={() => {
                    handleSave();
                  }}
                  className="text-base font-bold border rounded-full bg-white text-black  py-1 px-4 cursor-pointer hover:bg-gray-300"
                >
                  {!loading ? 'Save' : <BeatLoader color="black" size={10} />}
                </button>
              </div>
              <div className="flex flex-col gap-5 mt-5 relative">
                <div
                  style={{
                    backgroundImage:
                      inputBanner !== null
                        ? `url(${URL.createObjectURL(inputBanner)})`
                        : '',
                  }}
                  className="bg-gray-600 h-40 bg-cover bg-center"
                ></div>
                <img
                  src={
                    inputImage !== null
                      ? URL.createObjectURL(inputImage)
                      : profile.profilePicURL
                  }
                  alt="profile-picture"
                  className="absolute top-32 rounded-full h-24 w-24 border-black border-4 object-cover"
                />
                <label className="absolute rounded-full bg-gray-800 p-3 cursor-pointer top-[9.6em] left-[1.6em] opacity-80">
                  <MdOutlineAddAPhoto className=" text-white text-xl" />
                  <input
                    type="file"
                    name="myfile"
                    className="hidden"
                    onChange={(e) => setInputImage(e.target.files[0])}
                  />
                </label>
                <label className="absolute rounded-full bg-gray-800 p-3 cursor-pointer top-[3.6em] left-[14.8em] opacity-80">
                  <MdOutlineAddAPhoto className=" text-white text-xl" />
                  <input
                    type="file"
                    name="myfile"
                    className="hidden"
                    onChange={(e) => setInputBanner(e.target.files[0])}
                  />
                </label>
                <div className="border border-gray-700 rounded p-2 mt-[4em]">
                  <p className="text-gray-400 font-light text-sm">Name</p>
                  <input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="bg-black text-white outline-none mt-1 w-full placeholder:text-xl placeholder:text-gray-500"
                  />
                </div>
                <div className="border border-gray-700 rounded p-2 ">
                  <p className="text-gray-400 font-light text-sm">Bio</p>
                  <input
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="bg-black text-white outline-none mt-1 w-full placeholder:text-xl placeholder:text-gray-500"
                  />
                </div>
                <div className="border border-gray-700 rounded p-2 ">
                  <p className="text-gray-400 font-light text-sm">Website</p>
                  <input
                    value={profileLocation}
                    onChange={(e) => setProfileLocation(e.target.value)}
                    className="bg-black text-white outline-none mt-1 w-full placeholder:text-xl placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </Animate>
        </div>
      )}
      <div
        style={{ backgroundImage: `url(${profile.banner})` }}
        className="h-44 w-35 bg-gray-800 bg-cover bg-center"
      ></div>
      <div className="relative ml-5 ">
        <Popover>
          <Popover.Button>
            <img
              src={profile.profilePicURL}
              alt="profile-picture"
              className="absolute rounded-full h-36 w-36 object-cover border-black border-4 fixed top-[-3em] ml-0.5"
            />
          </Popover.Button>
          <Popover.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-80 z-40" />
          <Popover.Panel>
            <Animate play start={{ opacity: 0 }} end={{ opacity: 1 }}>
              <img
                alt="profile-picture"
                src={profile.profilePicURL}
                className="fixed top-1/2 h-max-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl mb-2 mr-1 max-w-[45em] z-50"
              />
            </Animate>
          </Popover.Panel>
        </Popover>
        <BsGear
          className="absolute left-[20.5em] p-1 text-2xl w-8 h-8 text-white hover:bg-gray-800 border rounded-full border-gray-500 cursor-pointer"
          onClick={() => {
            if (profile.uid === currentUser.uid) {
              setProfileName(profile.displayName);
              setShowEditor(true);
            }
          }}
        />

        <button
          onClick={() => {
            if (profile.uid !== currentUser.uid) handleFollow();
          }}
          className="absolute  left-[23.5em] text-black bg-white font-bold border rounded-full  py-1 px-4 cursor-pointer hover:bg-gray-200"
        >
          {!loading ? <p>{follow}</p> : <BeatLoader color="black" size={10} />}
        </button>
      </div>
      <div className="ml-5 mr-5 mt-20 flex flex-col gap-1">
        <div>
          <p className="font-bold">{profileName}</p>
          <p className="font-light text-gray-400">@{profile.username}</p>
        </div>
        <p>{profileBio}</p>
        {!profileLocation ? null : (
          <div className="flex items-center gap-1 cursor-not-allowed">
            <AiOutlineLink className="text-xl text-gray-400" />
            <p className="text-blue-500">{profileLocation}</p>
          </div>
        )}
        <div className="flex gap-2">
          <div
            onClick={() => router.push(`/user/${username}/following`)}
            className="flex items-center gap-1 cursor-pointer"
          >
            {profile.following ? <p>{profile.following.length}</p> : null}
            <p className="text-gray-400 font-light">Following</p>
          </div>
          <div
            onClick={() => router.push(`/user/${username}/followers`)}
            className="flex items-center gap-1 cursor-pointer"
          >
            {profile.followers ? <p>{profile.followers.length}</p> : null}{' '}
            <p className="text-gray-400 font-light">Followers</p>
          </div>
        </div>
      </div>
      <div className="flex mx-10 mt-8 mb-4 justify-between text-gray-400 font-bold text-sm">
        <p
          onClick={() => setIndex('userTweets')}
          style={{ color: index === 'userTweets' ? 'white' : '#9ca3af' }}
          className="cursor-pointer py-1 px-3"
        >
          Tweet
        </p>
        <p
          onClick={() => setIndex('userReplies')}
          style={{ color: index === 'userReplies' ? 'white' : '#9ca3af' }}
          className="cursor-pointer py-1 px-3"
        >
          Tweets & replies
        </p>
        <p
          onClick={() => setIndex('userMedia')}
          style={{ color: index === 'userMedia' ? 'white' : '#9ca3af' }}
          className="cursor-pointer py-1 px-3"
        >
          Media
        </p>
        <p
          onClick={() => setIndex('userLikes')}
          style={{ color: index === 'userLikes' ? 'white' : '#9ca3af' }}
          className="cursor-pointer py-1 px-3"
        >
          Likes
        </p>
      </div>
    </div>
  );
}
