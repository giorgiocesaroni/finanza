import React from "react";

export default function ListHeader({ setSort, filter, inverted }) {
  function handleStyling(field) {
    let className = "";
    if (field === filter) {
      className += "bold";
      if (inverted) className += " inverted";
    }
    return className;
  }

  return (
    <div className="description">
      <p onClick={setSort} className={handleStyling("type")}>
        Type
      </p>
      <p onClick={setSort} className={handleStyling("date")}>
        Date
      </p>
      <p onClick={setSort} className={handleStyling("price")}>
        Price
      </p>
      <p onClick={setSort} className={handleStyling("notes")}>
        Notes
      </p>
    </div>
  );
}
