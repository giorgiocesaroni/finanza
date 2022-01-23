import React, { useContext, useEffect, useState } from "react";
import Context from "../context";
import monthDay from "../utility/monthDay";
import Summary from "./Summary";
import accounting from "../utility/accounting";
import { deleteItem } from "../repository/firebase-repository";

export default function List({ title, data }) {
  const [inverted, setInverted] = useState(false);
  const [orderBy, setOrderBy] = useState("date");
  const [database, setDatabase] = useState(data);
  const { state, setState } = useContext(Context);

  useEffect(() => {
    setDatabase(sortCollection(data));
  }, [data]);

  function handleDelete(e) {
    console.log("handleDelete");
    setState({
      ...state,
      isEditing: false,
    });

    const id = e.target.id;

    // Intro mode
    if (!state.auth) {
      const tempDb = { ...database };
      delete tempDb[id];
      return setDatabase(tempDb);
    }

    return deleteItem(state.auth.user.uid, title.toLowerCase(), id);
  }

  function handleClick(k) {
    const id = k.target.parentElement.id;

    if (k.target.className.includes("delete")) return;

    if (id === state.editingId) {
      return setState({
        ...state,
        isEditing: false,
        editingId: null,
        editingItem: null,
      });
    }

    setState({
      ...state,
      isEditing: true,
      editingId: id,
      editingItem: data[id],
    });
  }

  function sortCollection(collection) {
    let filteredKeys = Object.keys(collection).sort((a, b) => {
      if (orderBy === "date") {
        if (new Date(collection[a][orderBy]) < new Date(collection[b][orderBy]))
          return 1;
        if (new Date(collection[a][orderBy]) > new Date(collection[b][orderBy]))
          return -1;
      }
      if (collection[a][orderBy] < collection[b][orderBy]) return -1;
      if (collection[a][orderBy] > collection[b][orderBy]) return 1;
      return 0;
    });

    if (inverted) {
      filteredKeys = filteredKeys.reverse();
    }

    let sortedDb = {};
    for (let key of filteredKeys) {
      sortedDb[key] = collection[key];
    }

    return sortedDb;
  }

  function setSort(e) {
    if (e.target.innerHTML.toLowerCase() === orderBy) {
      return setInverted(!inverted);
    }

    setOrderBy(e.target.innerHTML.toLowerCase());
  }

  function scroll() {
    this.listRef.current.scrollTo(0, 0);
  }

  return (
    <div className="element">
      <h2>{title}</h2>
      {/* <Summary database={collection} /> */}
      <div onClick={setSort} className="description">
        <p>Category</p>
        <p>Date</p>
        <p>Price</p>
        <p>Notes</p>
      </div>
      <div className="list">
        {database &&
          Object.keys(database).map((k) => {
            return (
              <div
                className={
                  state.isEditing && state.editingId === k ? "selected" : ""
                }
                key={k}
              >
                <div className="entry" id={k} onClick={handleClick}>
                  <span className="icon">{database[k].category}</span>
                  <p>{monthDay(database[k].date)}</p>
                  <p>{accounting.formatMoney(database[k].price)}</p>
                  <p>{database[k].notes}</p>
                  <span
                    role="img"
                    aria-label="emoji"
                    id={k}
                    onClick={handleDelete}
                    className="icon delete"
                  >
                    ❌
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
