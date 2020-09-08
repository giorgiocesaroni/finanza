import firebase from "firebase/app";
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

firebase.initializeApp(config);

export default firebase;
