import { db } from "../config/firebase";
import {
  query,
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

export function subscribeDatabase(uid, updateContext) {
  const expensesQuery = query(collection(db, `users/${uid}/expenses`));
  const unsubscribeDatabase = onSnapshot(expensesQuery, (snap) => {
    const entries = {};
    snap.forEach((doc) => {
      entries[doc.id] = doc.data();
    });
    updateContext({ database: entries });
  });

  return unsubscribeDatabase;
}

export function updateEntry(uid, editingId, entry) {
  console.log(uid, editingId, entry);
  const docRef = doc(db, `users/${uid}/expenses/${editingId}`);
  updateDoc(docRef, entry);
}

export function addEntry(uid, entry) {
  addDoc(collection(db, `users/${uid}/expenses`), entry);
}

export function deleteEntry(uid, id) {
  deleteDoc(doc(db, `users/${uid}/expenses/${id}`));
}
