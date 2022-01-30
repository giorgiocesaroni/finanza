import React, { useEffect, useContext } from "react";
import { Context } from "./context/ContextWrapper";
import { Intro } from "./components/Intro";
import { Form } from "./components/Form";
import { List } from "./components/List";
import { login, logout } from "./auth/auth-with-google";
import { getAuthFromLocalStorage } from "./auth/auth-local-storage";
import { subscribeDatabase } from "./repository/firebase-repository";
import { Menu } from "./components/Menu";

// Currently supported categories
export const supportedCategories = [
  { pizza: "🍕" },
  { gas: "⛽️" },
  { utility: "⚙️" },
  { groceries: "🥑" },
  { income: "💵" },
];

export const App = () => {
  const {
    context,
    updateContext,
    isOnline,
    isOpen,
    setOpen,
    handleLogin,
    handleLogout,
  } = useContext(Context);

  useEffect(() => {
    const authFromLocalStorage = getAuthFromLocalStorage();

    if (context.auth?.user) {
      const unsubscribe = subscribeDatabase(
        context.auth.user.uid,
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

  return (
    <>
      <Menu />
      <div
        className={
          "App" + (isOnline ? "" : " offline") + (isOpen ? " disabled" : "")
        }
      >
        <button onClick={() => setOpen(!isOpen)} className="open-menu">
          Open Menu
        </button>
        <Form />
        <main>
          {!context.auth && <Intro />}
          <List title="Personal" data={context.database} />
        </main>
      </div>
    </>
  );
};
