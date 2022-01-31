import React from "react";
import { useContext } from "react";
import { Context } from "../context/ContextWrapper";
import Authentication from "./Authentication";

export function Menu() {
  const { context, isOpen, setOpen } = useContext(Context);
  const user = context.auth?.user;

  return (
    <div className={"menu-plate" + (isOpen ? " blurred" : " disabled")}>
      <div className={"menu" + (isOpen ? " open" : "")}>
        <button onClick={() => setOpen(false)}>Close Menu</button>

        <img
          className="user-image"
          src={user?.photoURL}
          alt="User profile image"
        />
        <h2 className="user-display-name">Welcome, {user?.displayName}</h2>
        <h3 className="user-email">{user?.email}</h3>

        {/* List of portfolios */}
        <ul className="list-portfolios">
          <h3>Your Portfolios</h3>
          <li>
            <input type="checkbox" name="scales" />
            <label for="scales">Portfolio 1</label>
          </li>
          <li>
            <input type="checkbox" name="scales" />
            <label for="scales">Portfolio 2</label>
          </li>
          <li>
            <input type="checkbox" name="scales" />
            <label for="scales">Portfolio 3</label>
          </li>
        </ul>

        <Authentication />

        <p className="copyright">
          Copyright &copy; {new Date().getFullYear()} Giorgio Cesaroni. All
          rights reserved.
        </p>
      </div>
    </div>
  );
}
