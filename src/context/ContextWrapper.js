import React, { useState, createContext, useEffect } from "react";
import { useTestDatabase } from "../repository/useTestDatabase";
import { useOnline } from "../utility/useOnline";
import { login, logout } from "../auth/auth-with-google";

export const Context = createContext();

export const ContextWrapper = (props) => {
  const [testDatabase, testAddEntry, testUpdateEntry, testDeleteEntry] =
    useTestDatabase();

  const isOnline = useOnline();

  const [isOpen, setOpen] = useState(false);

  const [context, setContext] = useState({
    auth: null,
    state: {
      isEditing: false,
      editingId: null,
    },
  });

  const [database, setDatabase] = useState(testDatabase);

  const testDatabaseDAO = {
    addEntry: testAddEntry,
    updateEntry: testUpdateEntry,
    deleteEntry: testDeleteEntry,
  };

  useEffect(() => {
    updateDatabase(testDatabase);
  }, [testDatabase]);

  function updateDatabase(update) {
    return setDatabase((prev) => ({ ...prev, ...update }));
  }

  function updateContext(update) {
    return setContext((prev) => ({ ...prev, ...update }));
  }

  function toggleEditing(id, portfolio) {
    if (id) {
      return updateContext({
        state: { isEditing: true, editingId: id, portfolio: portfolio },
      });
    }
    return updateContext({
      state: { isEditing: false, editingId: null, portfolio: null },
    });
  }

  return (
    <Context.Provider
      value={{
        context,
        database,
        updateDatabase,
        updateContext,
        toggleEditing,
        testDatabaseDAO,
        isOnline,
        isOpen,
        setOpen,
        login,
        logout,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
