import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
} from "@env";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

console.log("🔥 Configuración cargada:", firebaseConfig);

// Evitar inicializar Firebase más de una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const database = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // ✅ inicializamos Auth

export { database, storage, auth };
