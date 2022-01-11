import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult, signInWithPopup } from "firebase/auth";
import firebaseApp from "../config/Firebase";

export default function auth() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    return new Promise(resolve => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                resolve({ "user": user, "token": token });
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    })
}