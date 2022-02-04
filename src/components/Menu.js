import React, { useContext } from "react";
import { Context } from "../context/ContextWrapper";
import Authentication from "./Authentication";
import { useFirestore } from "../repository/useFirestore";

export function Menu() {
  const { context, isOpen, setOpen } = useContext(Context);
  const { toggleEnabled } = useFirestore();
  const user = context.auth?.user;

  function handleCheck(e) {
    toggleEnabled(e.target.id);
  }

  return (
    <div className={"menu-plate" + (isOpen ? " blurred" : " disabled")}>
      <div className={"menu" + (isOpen ? " open" : "")}>
        <button onClick={() => setOpen(false)}>Close Menu</button>

        {user && <img
          className="user-image"
          src={user?.photoURL}
          alt="User profile image"
        />}
        <h2 className="user-display-name">Welcome, {user?.displayName}</h2>
        <h3 className="user-email">{user?.email}</h3>

        {/* List of portfolios */}

        {context.portfolios && <ul className="list-portfolios">
          <h3>Your Portfolios</h3>
          {context.portfolios?.map((p) => (
            <li>
              <input
                onClick={handleCheck}
                type="checkbox"
                name={p.name}
                id={p.id}
                checked={p.enabled}
              />
              <label for={p.name}>{p.name}</label>
            </li>
          ))}
        </ul>}

        <Authentication />

        <p className="copyright">
          Copyright &copy; {new Date().getFullYear()} Giorgio Cesaroni. All
          rights reserved.
        </p>
      </div>
    </div>
  );
}
