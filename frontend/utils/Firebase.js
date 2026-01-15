import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginonecart-f84d8.firebaseapp.com",
  projectId: "loginonecart-f84d8",
  storageBucket: "loginonecart-f84d8.firebasestorage.app",
  messagingSenderId: "165050215866",
  appId: "1:165050215866:web:4eb78f9335267c0e114183"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}
