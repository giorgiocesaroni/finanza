import React, { useContext } from "react";
import { Context } from "../context/ContextWrapper";

export default function Authentication() {
  const { context, updateContext, login, logout } = useContext(Context);

  if (context.auth)
    return (
      <button className="login" onClick={() => updateContext(logout())}>
        Logout
      </button>
    );

  return (
    <button
      className="login"
      onClick={async () => updateContext(await login())}
    >
      Login with Google
    </button>
  );
}
