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

import React, { useState, useEffect, useContext } from "react";
import { Context } from "../context/ContextWrapper";

export function useFirestore() {
  const { context } = useContext(Context);
  const uid = context.auth?.user.uid;
  const editPortfolio = context.state.portfolio;
  const editingId = context.state.editingId;

  const [database, setDatabase] = useState({});

  useEffect(() => {
    console.log("useFirestore - database changed.", database);
  }, [database]);

  useEffect(() => {
    if (uid) {
      subscribeAllPortfolios();
    }
  }, [uid]);

  function subscribePortfolio(portfolio) {
    const name = portfolio.data().name;
    const id = portfolio.id;

    const q = query(collection(db, `users/${uid}/portfolios/${id}/entries`));

    const entries = {};
    onSnapshot(q, (snap) => {
      snap.forEach((doc) => {
        entries[doc.id] = doc.data();
      });
    });

    setDatabase((prev) => ({
      ...prev,
      [id]: { name: name, entries: entries },
    }));
  }

  function subscribeAllPortfolios() {
    const q = query(collection(db, `users/${uid}/portfolios`));
    onSnapshot(q, (snap) => {
      snap.forEach((portfolio) => {
        subscribePortfolio(portfolio);
      });
    });
  }

  function updateEntry(entry) {
    const docRef = doc(
      db,
      `users/${uid}/portfolios/${editPortfolio}/entries/${editingId}`
    );
    updateDoc(docRef, entry);
  }

  function addEntry(portfolio = editPortfolio, entry) {
    addDoc(
      collection(db, `users/${uid}/portfolios/${portfolio}/entries`),
      entry
    );
  }

  function deleteEntry(portfolio, id) {
    deleteDoc(doc(db, `users/${uid}/portfolios/${portfolio}/entries/${id}`));
  }

  return database;

  return {
    database,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
