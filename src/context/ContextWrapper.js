import React, { useState, createContext, useEffect } from "react";
import { useTestDatabase } from "../repository/useTestDatabase";

export const Context = createContext();

export const ContextWrapper = (props) => {
  const [testDatabase, testAddEntry, testUpdateEntry, testDeleteEntry] =
    useTestDatabase();

  const [context, setContext] = useState({
    auth: null,
    database: testDatabase,
    state: {
      isEditing: false,
      editingId: null,
    },
  });

  const testDatabaseDAO = {
    addEntry: testAddEntry,
    updateEntry: testUpdateEntry,
    deleteEntry: testDeleteEntry,
  };

  useEffect(() => {
    updateContext({ database: testDatabase });
  }, [testDatabase]);

  function updateContext(update) {
    return setContext((prev) => ({ ...prev, ...update }));
  }

  function toggleEditing(id) {
    if (id) {
      return updateContext({ state: { isEditing: true, editingId: id } });
    }
    return updateContext({ state: { isEditing: false, editingId: null } });
  }

  return (
    <Context.Provider
      value={{
        context,
        updateContext,
        toggleEditing,
        testDatabaseDAO,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
