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

    function filterThisMonth(data) {
        if (!data) return;
        const filteredObject = {};
        for (const key in data) {
            if (new Date(data[key].date).getMonth() === new Date().getMonth()) {
                filteredObject[key] = data[key];
            }
        }
        return filteredObject;
    }

    function filterLastMonth(data) {
        if (!data) return;
        const filteredObject = {};
        for (const key in data) {
            if (
                new Date(data[key].date).getMonth() ===
                    new Date().getMonth() - 1 &&
                new Date(data[key].date).getFullYear() ===
                    new Date().getFullYear()
            ) {
                filteredObject[key] = data[key];
            }
        }
        return filteredObject;
    }

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
                    "App" +
                    (isOnline ? "" : " offline") +
                    (isOpen ? " disabled" : "")
                }
            >
                <button onClick={() => setOpen(!isOpen)} className="open-menu">
                    Open Menu
                </button>
                <Form />
                <main>
                    {!context.auth && <Intro />}
                    <List
                        title="This Month"
                        data={filterThisMonth(context.database)}
                    />
                    <List
                        title="Last Month"
                        data={filterLastMonth(context.database)}
                    />
                    <List
                        title="Up To Date"
                        data={context.database}
                    />
                </main>
            </div>
        </>
    );
};
