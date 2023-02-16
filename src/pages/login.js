import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

import Logo from '@/images/twitter-logo-white.png';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Animate, AnimateGroup, AnimateKeyframes } from 'react-simple-animate';
import { toast } from 'react-toastify';
import LoadingScreen from '../Components/LoadingScreen';
import { db } from '../firebase-config';

import { AiFillApple } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineEmail } from 'react-icons/md';

function generateUsername(name) {
  const randomNumber = Math.floor(Math.random() * 900) + 1;
  const newName = name.replace(/[^A-Z0-9]/gi, '') + '-' + randomNumber;
  return newName;
}

export default function Login({}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  async function handleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch {
      toast('Something went wrong, try again..');
      return;
    }

    const userIDs = [];
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
      userIDs.push(doc.id);
    });

    if (!userIDs.includes(getAuth().currentUser.uid)) {
      await setDoc(doc(db, 'users', `${getAuth().currentUser.uid}`), {
        displayName: getAuth().currentUser.displayName,
        uid: getAuth().currentUser.uid,
        username: generateUsername(getAuth().currentUser.displayName),
        profilePicURL: getAuth().currentUser.photoURL,
        newUser: true,
        followers: [],
        following: [],
      });
    }

    setIsLoading(true);
    setTimeout(() => {
      router.push('/Home');
    }, 2000);
  }

  return (
    <div>
      <Head>
        <title>Log in to Twitter</title>
      </Head>
      <div className="bg-gray-800 text-white h-screen w-screen flex justify-center items-center">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <Animate play start={{ opacity: 0 }} end={{ opacity: 1 }}>
            <div className="flex flex-col bg-black pb-32 px-32 pt-8 rounded-xl gap-3">
              <Image src={Logo} className="w-8 self-center" alt="logo" />
              <p className="text-3xl font-bold mb-4">Sign in to Twitter</p>
              <div
                className="flex items-center justify-center gap-3 w-full text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm px-5 py-1.5 text-center dark:bg-white cursor-pointer"
                onClick={handleSignIn}
              >
                <FcGoogle />
                <button>Sign in with Google</button>
              </div>
              <div className="flex items-center justify-center gap-3 w-full text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm px-5 py-1.5 text-center dark:bg-white cursor-not-allowed">
                <AiFillApple />
                <button className="cursor-not-allowed">
                  Sign in with Apple
                </button>
              </div>
              <div className="flex items-center justify-center gap-3 w-full text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm px-5 py-1.5 text-center dark:bg-white cursor-not-allowed">
                <MdOutlineEmail />
                <button className="cursor-not-allowed">
                  Sign in with email
                </button>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-b border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-1 text-sm text-white">or</span>
                </div>
              </div>
              <input
                className="bg-black border text-gray-700 border-gray-700 px-2 py-3 rounded cursor-not-allowed"
                placeholder="Phone, email or username"
              />
              <button className="mt-2 w-full text-white  hover:bg-gray-800 hover:bg-opacity-30 focus:ring-4 focus:outline-none focus:ring-blue-300 border border-white font-medium rounded-3xl text-sm px-5 py-1.5 text-center cursor-not-allowed">
                Forgot pasword?
              </button>
              <div className="flex gap-2 mt-10">
                <p>Don&apos;t have an account?</p>
                <p className="text-blue-500 cursor-not-allowed">Sign up</p>
              </div>
            </div>
          </Animate>
        )}
      </div>
    </div>
  );
}

Login.getLayout = (page) => page;
