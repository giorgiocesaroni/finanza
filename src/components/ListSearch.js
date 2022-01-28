import React, { useState } from "react";

export default function ListSearch({ setFilter }) {
  const [value, setValue] = useState(null);

  function handleChange(e) {
    const value = e.target.value;

    setValue(value);
    return setFilter(value);
  }

  return (
    <>
      <input
        onChange={handleChange}
        value={value}
        className="list-search"
        placeholder="Search..."
        type="text"
      />
    </>
  );
}
