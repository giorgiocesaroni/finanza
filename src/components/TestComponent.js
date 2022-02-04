import React, { useState, useEffect } from "react";
import { useFirestore } from "../repository/useFirestore";
import usePortfolio from "../repository/usePortfolio";
import { List } from "./List";

export default function TestComponent() {
  const [uid, setUid] = useState(null);
  const [portfolioId, setPortfolioId] = useState(null);
  const [database, setDatabase] = useState(null);

  // const { firestore } = useFirestore(uid);

  const portfolio = usePortfolio(uid, portfolioId);

  useEffect(() => {
    setTimeout(() => {
      setUid("Jki1yH4yQ8MHR0nOHU7hEsVgkuI2");
      setPortfolioId("sldkjfwokjslueriywo");
    }, 2000);
  }, []);

  // useEffect(() => {
  //   console.log("firestore changed", firestore);
  //   setTimeout(() => setDatabase(firestore), 2000);
  // }, [firestore]);

  return (
    <div>
      {/* <List data={portfolio} /> */}
      {JSON.stringify(portfolio)}
    </div>
  );
}
