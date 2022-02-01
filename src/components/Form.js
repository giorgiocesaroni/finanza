import React, { useRef, useEffect, useState, useContext } from "react";
import { supportedCategories } from "../App.js";
import { Context } from "../context/ContextWrapper";
import { useFirestore } from "../repository/useFirestore.js";

export const Form = () => {
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const { addEntry, updateEntry } = useFirestore();

  const { context, toggleEditing, testDatabaseDAO, isOnline } =
    useContext(Context);
  const amountInput = useRef(null);

  useEffect(() => {
    if (!context.state.editingId) return reset();
    const editEntry =
      context.database[context.state.portfolio].entries[
        [context.state.editingId]
      ];
    setCategory(editEntry.category);
    setDate(editEntry.date);
    setPrice(editEntry.price);
    setNotes(editEntry.notes);
  }, [context.state.editingId]);

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
      return setCategory("");
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
        updateEntry(
          context.auth.user.uid,
          context.state.portfolio,
          context.state.editingId,
          entry
        );
      } else {
        // Choose default portfolio?
        addEntry(context.auth.user.uid, "sldkjfwokjslueriywo", entry);
      }
      // Test mode (intro)
    } else {
      if (context.state.editingId) {
        testDatabaseDAO.updateEntry(context.state.editingId, entry);
      } else {
        testDatabaseDAO.addEntry(entry);
      }
    }

    reset();
  }

  return (
    <>
      <form id="entry-form" onKeyDown={handleSubmit}>
        {!isOnline && <div className="element is-offline">You're offline.</div>}
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
    </>
  );
};
