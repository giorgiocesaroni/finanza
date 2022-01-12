import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import AuthContext from "./auth-context";

export default function authWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    return new Promise((resolve, reject) => {
        signInWithPopup(auth, provider)
            .then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
    })
}

async function login() {
    const googleAuthCredentials = await authWithGoogle();
    this.setState({ auth: googleAuthCredentials });
    this.setState({ unsubscribeDatabase: this.subscribeDatabase() });
}

function logout() {
    this.setState({ auth: null, database: {} });
    this.unsubscribeDatabase();
}