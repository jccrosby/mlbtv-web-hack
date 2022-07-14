import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

export const useFirebaseApp = (config: FirebaseConfig) => {
    return initializeApp(config);
};

export const useFirestore = (config: FirebaseConfig) => {
    const app = useFirebaseApp(config);
    return getFirestore(app);
};
