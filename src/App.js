import React from "react";
import { useState, useEffect } from "react";
import Context from "./context";

import Intro from "./components/Intro";
import Form from "./components/Form";
import List from "./components/List";

import { login, logout } from "./auth/auth-with-google";
import { useCollection } from "./repository/firebase-repository";
import { getAuthFromLocalStorage } from "./auth/auth-local-storage";
import { testDatabase } from "./utility/testDatabase";

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
    state.auth ? state.auth.user.uid : null,
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
    <Context.Provider value={{ state: state, setState: setState, collection }}>
      <div className="App">
        <Form />

        {!state.auth && <Intro />}

        <List title="Expenses" data={collection} />

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
          Copyright &copy; {new Date().getFullYear()} Giorgio Cesaroni. All
          rights reserved.
        </p>
      </div>
    </Context.Provider>
  );
};
