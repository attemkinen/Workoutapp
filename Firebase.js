
import { initializeApp } from "firebase/app";
import { getDatabase,push,ref,onValue,remove } from "firebase/database";

const apiKey = process.env.EXPO_PUBLIC_ApiKey
const authDomain = process.env.EXPO_PUBLIC_authDomain
const databaseURL = process.env.EXPO_PUBLIC_databaseURL
const projectId =process.env.EXPO_PUBLIC_projectId
const storageBucket= process.env.EXPO_PUBLIC_storageBucket
const messagingSenderId = process.env.EXPO_PUBLIC_messagingSenderId
const appId = process.env.EXPO_PUBLIC_APP_ID

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
ref(database, "workouts/")

export {database,ref,onValue,remove, push}