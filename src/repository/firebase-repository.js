import { db } from "../config/firebase";
import { query, collection, doc, onSnapshot, deleteDoc } from "firebase/firestore";

export function subscribeDatabase(uid, app) {
  if (app.state.unsubscribeDatabase) return;

  const expensesQuery = query(collection(db, `users/${uid}/expenses`));
  onSnapshot(expensesQuery, snap => {
    const entries = {};
    snap.forEach(doc => {
      entries[doc.id] = doc.data();
    })
    app.setState({ database: entries });
  });
}

export function deleteExpense(uid, id) {
  deleteDoc(doc(db, `users/${uid}/expenses/${id}`));
}
