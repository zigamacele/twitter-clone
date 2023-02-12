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

// apiKey: 'AIzaSyBpJ8CA8p5FMwk8Rbo3heSkXm_5yiigMOo',
// authDomain: 'twitter-cl0ne.firebaseapp.com',
// projectId: 'twitter-cl0ne',
// storageBucket: 'twitter-cl0ne.appspot.com',
// messagingSenderId: '34904522694',
// appId: '1:34904522694:web:68e311cb35f1dba8a1bcc7',
