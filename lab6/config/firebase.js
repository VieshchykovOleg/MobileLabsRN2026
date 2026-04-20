import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD0js6Rq3vhdRXft43Q16bIKmOM4V26uYg",
  authDomain: "lab6-36f25.firebaseapp.com",
  projectId: "lab6-36f25",
  storageBucket: "lab6-36f25.firebasestorage.app",
  messagingSenderId: "732954865978",
  appId: "1:732954865978:web:13af9e2f9a400ba97be003"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
