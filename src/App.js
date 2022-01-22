import React from "react";
import { useState, useEffect } from "react";

import Intro from "./components/Intro";
import { Form } from "./components/Form";
import List from "./components/List";
import { login, logout } from "./auth/auth-with-google";
import { useCollection } from "./repository/firebase-repository";

// Context
import {
  AuthContext,
  RepositoryContext,
  AppStateContext,
} from "./context/Context";

import { getAuthFromLocalStorage } from "./auth/auth-local-storage";

// Currently supported categories
export const supportedCategories = [
  { pizza: "🍕" },
  { gas: "⛽️" },
  { utility: "⚙️" },
  { groceries: "🥑" },
  { income: "💵" },
];

export const App = () => {
  const [state, setState] = useState({
    isEditing: false,
    auth: null,
  });

  useEffect(() => {
    const authFromLocalStorage = getAuthFromLocalStorage();
    if (!state.auth && authFromLocalStorage) {
      setState({
        ...state,
        auth: getAuthFromLocalStorage(),
      });
    }
  }, []);

  const collection = useCollection(
    state.auth && state.auth.user.uid,
    "expenses"
  );

  async function handleLogin() {
    const authObject = await login();
    return setState({
      ...state,
      auth: authObject,
    });
  }

  function handleLogout() {
    logout();
    setState({
      ...state,
      auth: null,
    });
  }

  function toggleEditing(isEditing, id) {
    setState({
      ...state,
      isEditing: isEditing,
      editingId: id,
    });
  }

  return (
    <div className="App">
      <Form toggleEditing={toggleEditing} editEntry={state.editingId} />

      {!state.auth && (
        <>
          <Intro />
        </>
      )}

      <List
        title="Personal"
        database={collection}
        toggleEditing={toggleEditing}
        isEditing={state.isEditing}
        editingId={state.editingId}
        setState={setState}
      />

      {!state.auth ? (
        <button className="login" onClick={handleLogin}>
          Login with Google
        </button>
      ) : (
        <button className="login" onClick={handleLogout}>
          Logout from {state.auth.user.displayName}
        </button>
      )}

      <p className="copyright">
        Copyright &copy; {new Date().getFullYear()} Giorgio Cesaroni. All rights
        reserved.
      </p>
    </div>
  );
};
