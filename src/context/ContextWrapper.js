import React, { useState, createContext, useEffect } from "react";
import { testDatabase } from "../utility/testDatabase";

export const Context = createContext();

export const ContextWrapper = (props) => {
  const [context, setContext] = useState({
    auth: null,
    database: testDatabase,
    state: {
      isEditing: false,
      editingId: null,
    },
  });

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
    <Context.Provider value={{ context, updateContext, toggleEditing }}>
      {props.children}
    </Context.Provider>
  );
};
