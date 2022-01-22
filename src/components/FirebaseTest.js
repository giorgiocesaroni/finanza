import React from "react";
import { db } from "../config/Firebase";
import { collection, doc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

export default function FirebaseTest() {
  const [value, loading, error] = useDocument(
    doc(db, "users", "1hTBhD5TmIZr8SiunBUAtVlg6cv2"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  //   console.log(value);

  return (
    <div>
      <h1>Hello</h1>
      <p>{value && JSON.stringify(value.data())}</p>
    </div>
  );
}
