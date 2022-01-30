import React from "react";
import { useContext } from "react";
import { Context } from "../context/ContextWrapper";

export function Menu() {
  const { isOpen, setOpen } = useContext(Context);

  return (
    <div className={"menu-plate" + (isOpen ? " blurred" : " disabled")}>
      <div className={"menu" + (isOpen ? " open" : "")}>
        <button onClick={() => setOpen(false)}>Close Menu</button>
      </div>
    </div>
  );
}
