import React, { useRef, useEffect, useState, useContext } from "react";
import { supportedCategories } from "../App.js";
import { Context } from "../context/ContextWrapper";
import { addEntry, updateEntry } from "../repository/firebase-repository";
import { useTestDatabase } from "../repository/useTestDatabase.js";

export const Form = (props) => {
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  const { context, updateContext, toggleEditing, testDatabaseDAO } = useContext(Context);
  const amountInput = useRef(null);

  useEffect(() => {
    if (!context.state.editingId) return reset();
    setCategory(context.database[context.state.editingId].category);
    setDate(context.database[context.state.editingId].date);
    setPrice(context.database[context.state.editingId].price);
    setNotes(context.database[context.state.editingId].notes);
  }, [context.state.editingId]);

  const [value, setValue] = useTestDatabase();

  function focus() {
    amountInput.current.focus();
  }

  function reset() {
    toggleEditing();
    setCategory("");
    setDate("");
    setPrice("");
    setNotes("");
  }

  function handleDateChange(e) {
    const value = e.target.value;
    setDate(value);
  }

  function handleNotesChange(e) {
    const value = e.target.value;
    setNotes(value);
  }

  function handlePriceChange(e) {
    const value = e.target.value;
    setPrice(value);
  }

  function handleCategoryChange(e) {
    const value = e.target.id;
    setCategory(value);
  }

  function handleCategoryClick(e) {
    const value = e.target.id;
    if (value === category) {
      return setCategory('');
    }
    focus();
  }

  function handleSubmit(e) {
    if (e.keyCode !== 13) return;

    // Reset if no price
    if (!price) {
      return reset();
    }

    // Polished entry
    const entry = {
      category: category || "❓",
      date: date ? String(new Date(date)) : String(new Date()),
      notes: notes,
      price: Number(price) || 0,
    };

    // Submit: create/update on logged user
    if (context.auth) {
      if (context.state.isEditing) {
        updateEntry(context.auth.user.uid, context.state.editingId, entry);
      } else {
        addEntry(context.auth.user.uid, entry);
      }
      // Test mode (intro)
    }
    else {
      if (context.state.editingId) {
        testDatabaseDAO.updateEntry(context.state.editingId, entry);
      } else {
        testDatabaseDAO.addEntry(entry);
      }
    }

    reset();
  }

  return (
    <form id="entry-form" onKeyDown={handleSubmit}>
      <div className="display">
        <>
          <input
            value={date}
            onChange={handleDateChange}
            type="text"
            placeholder="Date"
            name="date"
            className="date"
          />
          <input
            value={notes}
            onChange={handleNotesChange}
            type="text"
            placeholder="Notes"
            name="notes"
            className="notes"
          />
        </>
        <input
          ref={amountInput}
          value={price}
          onChange={handlePriceChange}
          id="display-amount"
          type="number"
          placeholder="$"
          name="price"
          className="amount"
        />
      </div>

      <div className="categories-selector">
        {supportedCategories.map((i) => {
          let _category = Object.keys(i)[0];
          let emoji = i[_category];
          return (
            <label
              onClick={handleCategoryClick}
              htmlFor={_category}
              key={_category}
              className={emoji === category ? null : "highlighted"}
            >
              <span role="img" aria-label={"Emoji of " + _category}>
                {emoji}
              </span>
              <input
                checked={emoji === category}
                onChange={handleCategoryChange}
                type="radio"
                id={emoji}
                name="category"
              />
            </label>
          );
        })}
      </div>
    </form>
  );
};
