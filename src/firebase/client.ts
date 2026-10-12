import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { firebaseConfig } from './config'

export const firebaseApp: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const firestore = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
