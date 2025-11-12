import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDQU9a2lVKae4PIcjCc9Oq-8jQoTmlSy7c",
  authDomain: "marpro-f492a.firebaseapp.com",
  projectId: "marpro-f492a",
  storageBucket: "marpro-f492a.firebasestorage.app",
  messagingSenderId: "147225524799",
  appId: "1:147225524799:web:30d9b03624561a730d968a"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app)

export default app
