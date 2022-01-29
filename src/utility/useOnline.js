import React, { useState, useEffect } from "react";

export function useOnline() {
  const [isOnline, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
  });

  return isOnline;
}
