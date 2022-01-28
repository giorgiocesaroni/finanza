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
    <div onClick={setSort} className="description">
      <p className={handleStyling("category")}>Category</p>
      <p className={handleStyling("date")}>Date</p>
      <p className={handleStyling("price")}>Price</p>
      <p className={handleStyling("notes")}>Notes</p>
    </div>
  );
}
