import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import 'firebase/database';

const config = {
  apiKey: "AIzaSyCE5pA2JSdfAPD5qnWsEEvOXEx-pI4aeLk",
  authDomain: "finanza-react.firebaseapp.com",
  databaseURL: "https://finanza-react.firebaseio.com",
  projectId: "finanza-react",
  storageBucket: "finanza-react.appspot.com",
  messagingSenderId: "88000701371",
  appId: "1:88000701371:web:9b451832ac2b498fea1a9e"
};

const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp);

export default firebaseApp;
export { firebaseApp, db };