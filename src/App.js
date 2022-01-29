import React, { useState, useEffect, useContext } from "react";
import { Context } from "./context/ContextWrapper";
import { Intro } from "./components/Intro";
import { Form } from "./components/Form";
import { List } from "./components/List";
import { login, logout } from "./auth/auth-with-google";
import { getAuthFromLocalStorage } from "./auth/auth-local-storage";
import { testDatabase } from "./utility/testDatabase";
import { subscribeDatabase } from "./repository/firebase-repository";

// Currently supported categories
export const supportedCategories = [
  { pizza: "🍕" },
  { gas: "⛽️" },
  { utility: "⚙️" },
  { groceries: "🥑" },
  { income: "💵" },
];

export const App = () => {
  const { context, updateContext, testDatabase } = useContext(Context);

  useEffect(() => {
    const authFromLocalStorage = getAuthFromLocalStorage();

    if (context.auth) {
      const unsubscribe = subscribeDatabase(
        authFromLocalStorage.user.uid,
        updateContext
      );
      return unsubscribe;
    }

    if (!context.auth && authFromLocalStorage) {
      updateContext({
        auth: authFromLocalStorage,
      });
      const unsubscribe = subscribeDatabase(
        authFromLocalStorage.user.uid,
        updateContext
      );
      return unsubscribe;
    }
  }, [context.auth]);

  async function handleLogin() {
    const auth = await login();
    return updateContext({
      auth: auth,
    });
  }

  function handleLogout() {
    logout();
    updateContext({
      auth: null,
      database: testDatabase,
    });
  }

  return (
    <div className="App">
      <Form />
      <main>
        {!context.auth && <Intro />}
        {/* <Intro />
        <Intro />
        <Intro /> */}
        <List title="Personal" data={context.database} />
      </main>
      <footer>
        {!context.auth ? (
          <button className="login" onClick={handleLogin}>
            Login with Google
          </button>
        ) : (
          <button className="login" onClick={handleLogout}>
            Logout from {context.auth.user.displayName}
          </button>
        )}
        <p className="copyright">
          Copyright &copy; {new Date().getFullYear()} Giorgio Cesaroni. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
};
