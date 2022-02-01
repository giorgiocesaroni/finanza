import React, { useEffect, useState, useContext } from "react";
import { Context } from "./context/ContextWrapper";
import { Intro } from "./components/Intro";
import { Form } from "./components/Form";
import { List } from "./components/List";
import { getAuthFromLocalStorage } from "./auth/auth-local-storage";
import { Menu } from "./components/Menu";
import { useFirestore } from "./repository/useFirestore";

// Currently supported categories
export const supportedCategories = [
  { pizza: "🍕" },
  { gas: "⛽️" },
  { utility: "⚙️" },
  { groceries: "🥑" },
  { income: "💵" },
];

export const App = () => {
  const database = useFirestore();
  const { context, updateContext, isOnline, isOpen, setOpen, updateDatabase } =
    useContext(Context);

  useEffect(() => {
    console.log("App - database changed", database);
  }, [database]);

  useEffect(() => {
    const authFromLocalStorage = getAuthFromLocalStorage();

    if (!context.auth && authFromLocalStorage) {
      updateContext({
        auth: authFromLocalStorage,
      });
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

          {Object.keys(database).map((portfolioKey) => {
            return (
              <List
                key={portfolioKey}
                title={database[portfolioKey].name}
                data={database[portfolioKey].entries}
              />
            );
          })}
        </main>
      </div>
    </>
  );
};
