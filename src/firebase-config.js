import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyCKXl7UdbnsjVAJzPdoRjrbhU7IASVn510',
  authDomain: 'twitter-clone-f7d17.firebaseapp.com',
  projectId: 'twitter-clone-f7d17',
  storageBucket: 'twitter-clone-f7d17.appspot.com',
  messagingSenderId: '495853058800',
  appId: '1:495853058800:web:af6b54b9c6eac395432035',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
