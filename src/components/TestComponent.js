import React, { useContext, useEffect } from "react";
import { Context } from "../context/Context";

export function TestComponent() {
  const { context, updateContext } = useContext(Context);

  useEffect(() => {
    updateContext({ TestComponent: "TestComponent" });
  }, []);

  return <div></div>;
}
