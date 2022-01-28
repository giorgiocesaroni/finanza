import React, { useState, useContext, useEffect } from "react";
import monthDay from "../utility/monthDay";
import Summary from "./Summary";
import accounting from "../utility/accounting";
import { Context } from "../context/ContextWrapper";
import { deleteEntry } from "../repository/firebase-repository";
import ListHeader from "./ListHeader";
import ListSearch from "./ListSearch";

export const List = (props) => {
  const [state, setState] = useState({
    inverted: false,
    sortBy: "date",
    endOfListTop: true,
    endOfListBottom: true,
  });
  const [filter, setFilter] = useState("");
  const [data, setData] = useState(sortData(props.data));
  const { context, toggleEditing, testDatabaseDAO } = useContext(Context);

  useEffect(() => {
    setData(sortData(filterData(props.data)));
  }, [props.data, state.sortBy, state.inverted, filter]);

  function filterData(data) {
    const filteredKeys = Object.keys(data).filter((i) =>
      data[i].notes.toLowerCase().includes(filter.toLowerCase().trim())
    );

    const filteredData = {};
    filteredKeys.forEach((i) => {
      filteredData[i] = data[i];
    });

    return filteredData;
  }

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

  function sortData(data) {
    const database = { ...data };
    let sortBy = state.sortBy;
    let sortByedKeys = Object.keys(database).sort((a, b) => {
      if (sortBy === "date") {
        if (new Date(database[a][sortBy]) < new Date(database[b][sortBy]))
          return 1;
        if (new Date(database[a][sortBy]) > new Date(database[b][sortBy]))
          return -1;
      }
      if (sortBy === "price") {
        if (database[a][sortBy] < database[b][sortBy]) return 1;
        if (database[a][sortBy] > database[b][sortBy]) return -1;
      }
      if (database[a][sortBy] < database[b][sortBy]) return -1;
      if (database[a][sortBy] > database[b][sortBy]) return 1;
      return 0;
    });

    if (state.inverted) {
      sortByedKeys = sortByedKeys.reverse();
    }

    let sortedDatabase = {};
    for (let key of sortByedKeys) {
      sortedDatabase[key] = database[key];
    }

    return sortedDatabase;
  }

  function setSort(e) {
    if (e.target.innerHTML.toLowerCase() === state.sortBy) {
      return setState((prev) => ({ ...prev, inverted: !prev.inverted }));
    }
    setState({
      ...state,
      inverted: false,
      sortBy: e.target.innerHTML.toLowerCase(),
    });
  }

  return (
    <div className="element">
      <div className="title-search">
        <h2 className="title">{props.title}</h2>
        <ListSearch setFilter={setFilter} />
      </div>
      <Summary data={data} />
      <ListHeader
        setSort={setSort}
        sortBy={state.sortBy}
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
