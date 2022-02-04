import { db } from "../config/firebase";
import {
  query,
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import React, { useState, useEffect, useContext } from "react";

import { Context } from "../context/ContextWrapper";

export function useFirestore() {
  const { context } = useContext(Context);
  const uid = context.auth?.user.uid;
  const [portfolios, setPortfolios] = useState(null);

  useEffect(() => {
    console.log(uid);
    if (uid) {
      subscribePortfolios(uid);
    }
  }, [uid]);

  function subscribePortfolios(uid) {
    const q = query(collection(db, `users/${uid}/portfolios`));
    onSnapshot(q, (snap) => {
      const portfolios = [];
      snap.forEach((portfolio) => {
        portfolios.push({
          name: portfolio.data().name,
          id: portfolio.id,
          enabled: portfolio.data().enabled,
        });
      });
      setPortfolios(portfolios);
    });
  }

  function updateEntry(portfolioId, editingId, entry) {
    const docRef = doc(
      db,
      `users/${uid}/portfolios/${portfolioId}/entries/${editingId}`
    );
    updateDoc(docRef, entry);
  }

  function addEntry(portfolioId, entry) {
    addDoc(
      collection(db, `users/${uid}/portfolios/${portfolioId}/entries`),
      entry
    );
  }

  function deleteEntry(portfolioId, editingId) {
    deleteDoc(
      doc(db, `users/${uid}/portfolios/${portfolioId}/entries/${editingId}`)
    );
  }

  async function toggleEnabled(portfolioId) {
    const docRef = doc(db, `users/${uid}/portfolios/${portfolioId}`);
    const document = await getDoc(docRef);
    const isEnabled = document.data().enabled;
    updateDoc(docRef, { enabled: !isEnabled });
  }

  return {
    portfolios,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleEnabled,
  };
}
