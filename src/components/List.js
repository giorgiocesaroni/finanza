import React, { useState, useContext, useEffect, useRef } from "react";
import monthDay from "../utility/monthDay";
import Summary from "./Summary";
import accounting from "../utility/accounting";
import { Context } from "../context/ContextWrapper";
import { deleteEntry } from "../repository/firebase-repository";
import ListHeader from "./ListHeader";

export const List = (props) => {
  const [state, setState] = useState({
    inverted: false,
    filter: "date",
    endOfListTop: true,
    endOfListBottom: true,
  });

  const [data, setData] = useState(sortDb(props.data));

  const { context, toggleEditing, testDatabaseDAO } = useContext(Context);

  useEffect(() => {
    setData(sortDb(props.data));
  }, [props.data, state.filter, state.inverted]);

  function handleDelete(id) {
    toggleEditing();

    // Intro mode
    if (!context.auth) {
      return testDatabaseDAO.deleteEntry(id);
    }

    return deleteEntry(context.auth.user.uid, id);
  }

  function handleClick(k) {
    if (k.target.className.includes("delete")) return;

    const id = k.target.parentElement.id;

    if (id === context.state.editingId) {
      return toggleEditing();
    }

    return toggleEditing(id);
  }

  function sortDb() {
    const database = { ...props.data };
    let filter = state.filter;
    let filteredKeys = Object.keys(database).sort((a, b) => {
      if (filter === "date") {
        if (new Date(database[a][filter]) < new Date(database[b][filter]))
          return 1;
        if (new Date(database[a][filter]) > new Date(database[b][filter]))
          return -1;
      }
      if (filter === "price") {
        if (database[a][filter] < database[b][filter]) return 1;
        if (database[a][filter] > database[b][filter]) return -1;
      }
      if (database[a][filter] < database[b][filter]) return -1;
      if (database[a][filter] > database[b][filter]) return 1;
      return 0;
    });

    if (state.inverted) {
      filteredKeys = filteredKeys.reverse();
    }

    let sortedDatabase = {};
    for (let key of filteredKeys) {
      sortedDatabase[key] = database[key];
    }

    return sortedDatabase;
  }

  function setSort(e) {
    if (e.target.innerHTML.toLowerCase() === state.filter) {
      return setState((prev) => ({ ...prev, inverted: !prev.inverted }));
    }
    setState({
      ...state,
      inverted: false,
      filter: e.target.innerHTML.toLowerCase(),
    });
  }

  function scroll() {
    this.listRef.current.scrollTo(0, 0);
  }

  return (
    <div className="element">
      <h2>{props.title}</h2>
      <Summary data={data} />
      <ListHeader
        setSort={setSort}
        filter={state.filter}
        inverted={state.inverted}
      />
      <div className="list-wrapper">
        {/* <div
          className={
            "list-continues-bottom" + (!state.endOfListBottom ? " visible" : "")
          }
        ></div>
        <div
          className={
            "list-continues-top" + (!state.endOfListTop ? " visible" : "")
          }
        ></div> */}

        <div className="list">
          {data &&
            Object.keys(data).map((k) => {
              return (
                <div
                  className={
                    context.state.isEditing && context.state.editingId === k
                      ? "selected"
                      : ""
                  }
                  key={k}
                >
                  <div className="entry" id={k} onClick={handleClick}>
                    <span className="icon">{data[k].category}</span>
                    <p>{monthDay(data[k].date)}</p>
                    <p>{accounting.formatMoney(data[k].price)}</p>
                    <p>{data[k].notes}</p>
                    <span
                      role="img"
                      aria-label="emoji"
                      id={k}
                      onClick={() => handleDelete(k)}
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
    </div>
  );
};
