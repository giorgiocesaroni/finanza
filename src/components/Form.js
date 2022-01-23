import React, { useRef, useEffect, useState, useContext } from "react";
import { supportedCategories } from "../App.js";
import Context from "../context";
import { addItem, updateItem } from "../repository/firebase-repository";

const Form = () => {
  const { state, setState, collection } = useContext(Context);
  const [category, setCategory] = useState();
  const [date, setDate] = useState();
  const [price, setPrice] = useState();
  const [notes, setNotes] = useState();

  const amountInput = useRef(null);

  useEffect(() => {
    if (!state.editingItem) return reset();
    setCategory(state.editingItem.category);
    setDate(state.editingItem.date);
    setPrice(state.editingItem.price);
    setNotes(state.editingItem.notes);
  }, [state.editingItem]);

  function focus() {
    amountInput.current.focus();
  }

  function reset() {
    setState({ ...state, editingId: null, editingItem: null });
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
    if (state.auth) {
      if (state.isEditing) {
        updateItem(state.auth.user.uid, "expenses", state.editingId, entry);
      } else {
        addItem(state.auth.user.uid, "expenses", entry);
      }
      // Test mode (intro)
    } else {
      if (state.editingId) {
        collection[state.editingId] = entry;
      } else {
        collection[`${Math.random() * 100}`] = entry;
      }
      setState(collection);
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

export default Form;
