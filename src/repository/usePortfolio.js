import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";

export default function usePortfolio(uid, portfolioId) {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, `users/${uid}/portfolios/${portfolioId}/entries`)
      );
      
      onSnapshot(q, (snap) => {
        const entries = {};
        snap.forEach((doc) => {
          entries[doc.id] = doc.data();
        });
        setPortfolio(entries);
      });
  }, [uid, portfolioId]);

  return portfolio;
}
