import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyD3rdOWqjl2XjIgXuG9e2-BXLdOTpOqBHY",
	authDomain: "wfi-react-e91f4.firebaseapp.com",
	projectId: "wfi-react-e91f4",
	storageBucket: "wfi-react-e91f4.firebasestorage.app",
	messagingSenderId: "837002515194",
	appId: "1:837002515194:web:5c3b1f7a5ef2620f86af43",
};

const firebaseApp =
	getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const firestore = getFirestore(firebaseApp);
