import React, { useRef, useEffect, useState, useContext } from "react";
import { supportedCategories } from "../App.js";
import { AppStateContext, AuthContext } from "../context/Context";
import { addEntry, updateEntry } from "../repository/firebase-repository";

export const Form = (props) => {
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  const authContext = useContext(AuthContext);
  const appStateContext = useContext(AppStateContext);

  const amountInput = useRef(null);

  useEffect(() => {
    if (!props.editEntry) return reset();
    setCategory(props.editEntry.category);
    setDate(props.editEntry.date);
    setPrice(props.editEntry.price);
    setNotes(props.editEntry.notes);
  }, [props.editEntry]);

  function focus() {
    amountInput.current.focus();
  }

  function reset() {
    props.toggleEditing();
    console.log(appStateContext);
    // appStateContext.setAppState({});
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
    if (authContext) {
      console.log(appStateContext.editingId);
      if (appStateContext.isEditing) {
        updateEntry(authContext.user.uid, appStateContext.editingId, entry);
      } else {
        addEntry(authContext.user.uid, entry);
      }
      // Test mode (intro)
    } else {
      if (appStateContext.editingId) {
        props.database[appStateContext.editingId] = entry;
      } else {
        props.database[`${Math.random() * 100}`] = entry;
      }
      props.setState(props.database);
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
              onClick={focus}
              htmlFor={_category}
              key={_category}
              className={emoji === category ? "highlighted" : null}
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
