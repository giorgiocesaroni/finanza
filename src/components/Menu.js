import React from "react";
import { useContext } from "react";
import { Context } from "../context/ContextWrapper";

export function Menu() {
  const { context, isOpen, setOpen } = useContext(Context);
  const user = context.auth?.user;

  return (
    <div className={"menu-plate" + (isOpen ? " blurred" : " disabled")}>
      <div className={"menu" + (isOpen ? " open" : "")}>
        <button onClick={() => setOpen(false)}>Close Menu</button>
        <img src={user?.photoURL} alt="User profile image" />
        <h2>Welcome, {user?.displayName}</h2>
        <h3>{user?.email}</h3>
      </div>
    </div>
  );
}
