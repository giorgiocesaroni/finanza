import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setAuthToLocalStorage, removeAuthFromLocalStorage } from "./auth-local-storage";

function googleAuth() {
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

export async function login() {
    const googleAuthObject = await googleAuth();
    setAuthToLocalStorage(googleAuthObject);
    return googleAuthObject;
}

export function logout() {
    removeAuthFromLocalStorage();
}

export const AuthContext = new React.createContext();
