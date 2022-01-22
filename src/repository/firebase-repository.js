import { db } from "../config/Firebase";
import { useState, useEffect } from "react";
import {
  query,
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { testDatabase } from "../utility/testDatabase";

export function useCollection(uid, path) {
  const [myCollection, setCollection] = useState(testDatabase);

  useEffect(() => {
    if (uid) {
      const collectionQuery = query(collection(db, `users/${uid}/${path}`));
      const unsubscribeDatabase = onSnapshot(collectionQuery, (snap) => {
        const items = {};
        snap.forEach((doc) => {
          items[doc.id] = doc.data();
        });
        setCollection(items);
      });
      return () => unsubscribeDatabase();
    } else {
      setCollection(testDatabase);
    }
  }, [uid]);

  return myCollection;
}

export function updateItem(uid, path, itemId, item) {
  const docRef = doc(db, `users/${uid}/${path}/${itemId}`);
  updateDoc(docRef, item);
}

export function addItem(uid, path, item) {
  addDoc(collection(db, `users/${uid}/${path}`), item);
}

export function deleteItem(uid, path, itemId) {
  deleteDoc(doc(db, `users/${uid}/${path}/${itemId}`));
}
