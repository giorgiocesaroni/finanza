import React, { useEffect, useContext } from "react";
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
  const { context, updateContext, isOnline, isOpen, setOpen } =
    useContext(Context);
  const { portfolios } = useFirestore();

  useEffect(() => {
    const authFromLocalStorage = getAuthFromLocalStorage();

    if (!context.auth && authFromLocalStorage) {
      updateContext({
        auth: authFromLocalStorage,
      });
    }
  }, [context.auth]);

  useEffect(() => {
    updateContext({ portfolios: portfolios });
  }, [portfolios]);

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

          {context.portfolios &&
            context.portfolios.map((portfolio) => {
              return (
                portfolio.enabled && (
                  <List
                    uid={context.auth?.user.uid}
                    name={portfolio.name}
                    portfolioId={portfolio.id}
                  />
                )
              );
            })}
        </main>
      </div>
    </>
  );
};
