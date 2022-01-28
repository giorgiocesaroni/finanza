import React, { useState } from "react";

export default function ListSearch({ data, setData }) {
  const [value, setValue] = useState("");

  function handleChange(e) {
    setValue(e.target.value);
  }

  return (
    <input
      onChange={handleChange}
      value={value}
      className="search"
      placeholder="Search..."
    />
  );
}
