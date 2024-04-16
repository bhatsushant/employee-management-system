import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  Auth
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY!,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN!,
  projectId: import.meta.env.VITE_PROJECT_ID!,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET!,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID!,
  appId: import.meta.env.VITE_APP_ID!
};

initializeApp(firebaseConfig);

export const auth: Auth = getAuth();

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const createNativeUser = async (email: string, password: string) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const nativeSignIn = async (email: string, password: string) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback: (user: any) => void) =>
  onAuthStateChanged(auth, callback);

export const emailUpdate = async (email: string) => {
  if (!email) return;

  return await updateEmail(auth.currentUser!, email);
};
