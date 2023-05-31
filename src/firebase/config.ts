import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  addDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
  DocumentData,
} from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAVSZ2Wyq_2il303-UBMCZvSjdQUsZgHyY',
  authDomain: 'diplom-b8df8.firebaseapp.com',
  projectId: 'diplom-b8df8',
  storageBucket: 'diplom-b8df8.appspot.com',
  messagingSenderId: '10000325506',
  appId: '1:10000325506:web:cb7b425a71d75014544d9b',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export {
  app,
  auth,
  db,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  serverTimestamp,
  Timestamp,
  getAuth
};