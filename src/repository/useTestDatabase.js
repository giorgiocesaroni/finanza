import React, { useState, useEffect, useContext } from "react";
import { testDatabase } from "../utility/testDatabase";

export const useTestDatabase = () => {
  const [database, setDatabase] = useState(testDatabase);

  function updateEntry(editingId, entry) {
    console.log("updateEntry");
    setDatabase({ ...database, [editingId]: entry });
  }

  function addEntry(entry) {
    console.log("addEntry");
    function generateId() {
      return Math.random() * 100;
    }

    setDatabase({ ...database, [generateId()]: entry });
  }

  function deleteEntry(id) {
    console.log("deleteEntry");
    const tempDatabase = { ...database };
    delete tempDatabase[id];
    setDatabase(tempDatabase);
  }

  return [database, addEntry, updateEntry, deleteEntry];
};
