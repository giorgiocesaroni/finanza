import React from "react";

export const AppStateContext = new React.createContext({
  appState: null,
  setAppState: () => {},
});
export const AuthContext = new React.createContext();
export const RepositoryContext = new React.createContext();
