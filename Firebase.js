import { initializeApp } from "firebase/app"; 
import { getDatabase, push, ref, onValue, remove } from "firebase/database"; 

// Alustetaan muuttujat Firebase-projektin konfigurointitiedoille
const apiKey = process.env.EXPO_PUBLIC_ApiKey; // API-avain
const authDomain = process.env.EXPO_PUBLIC_authDomain; // Authentikointialue
const databaseURL = process.env.EXPO_PUBLIC_databaseURL; // Tietokannan URL
const projectId = process.env.EXPO_PUBLIC_projectId; // Projektin tunnus
const storageBucket = process.env.EXPO_PUBLIC_storageBucket; // Tallennusämpäri
const messagingSenderId = process.env.EXPO_PUBLIC_messagingSenderId; // Viestien lähettäjän tunnus
const appId = process.env.EXPO_PUBLIC_APP_ID; // Sovelluksen tunnus

// Luodaan Firebase-konfiguraatiokokonaisuus
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

// Alustetaan Firebase käyttäen konfiguraatiota
const app = initializeApp(firebaseConfig); // Alustetaan Firebase-sovellus
const database = getDatabase(app); // Haetaan Firebase-tietokanta

// Eksportoidaan tietokanta ja tietokantatoiminnot moduulina
export { database, ref, onValue, remove, push };
