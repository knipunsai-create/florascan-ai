
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAyz-pCGpycC4X6dkwLeyvy_iJXoD8WvV0',
  authDomain: 'florascan-ai-598c7.firebaseapp.com',
  projectId: 'florascan-ai-598c7',
  storageBucket: 'florascan-ai-598c7.firebasestorage.app',
  messagingSenderId: '436679219590',
  appId: '1:436679219590:web:7dfc753c8b528433687407',
  measurementId: 'G-713W8TFV59',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signOut,
}
