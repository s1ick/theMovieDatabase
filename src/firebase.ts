import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация сервисов
const auth = getAuth(app);
const db = getFirestore(app);

// Включение оффлайн-режима с обработкой ошибок TypeScript
const enableOfflinePersistence = async () => {
  try {
    await enableIndexedDbPersistence(db);
    console.log('Firestore offline persistence enabled');
  } catch (error: unknown) {
    if (error instanceof Error) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'failed-precondition') {
        console.warn('Offline persistence is already enabled in another tab');
      } else if (firebaseError.code === 'unimplemented') {
        console.warn('Current browser does not support offline persistence');
      } else {
        console.error('Error enabling offline persistence:', error);
      }
    } else {
      console.error('Unknown error enabling offline persistence:', error);
    }
  }
};

// Активируем оффлайн-режим
enableOfflinePersistence();

// Экспорт сервисов
export { db, auth, app };