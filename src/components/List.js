import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/ContextWrapper";
import { useFirestore } from "../repository/useFirestore";
import usePortfolio from "../repository/usePortfolio";
import accounting from "../utility/accounting";
import monthDay from "../utility/monthDay";
import { testDatabase } from "../utility/testDatabase";
import ListHeader from "./ListHeader";
import ListSearch from "./ListSearch";
import Summary from "./Summary";

export const List = ({ uid = null, portfolioId = null, name = "Demo" }) => {
  const [state, setState] = useState({
    inverted: false,
    sortBy: "date",
    endOfListTop: true,
    endOfListBottom: true,
  });
  const portfolio = usePortfolio(uid, portfolioId);
  const [data, setData] = useState(portfolio ?? testDatabase);
  const [filter, setFilter] = useState("");
  const { context, database, toggleEditing, testDatabaseDAO } =
    useContext(Context);
  const { deleteEntry } = useFirestore();

  useEffect(() => {
    setData(filterData(sortData(data)));
  }, [state, portfolio, filter]);

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

  function handleDelete(editingId) {
    toggleEditing();

    // Intro mode
    if (!context.auth) {
      return testDatabaseDAO.deleteEntry(editingId);
    }

    return deleteEntry(portfolioId, editingId);
  }

  function handleClick(k) {
    if (k.target.className.includes("delete")) return;

    const entryId = k.target.parentElement.id;

    if (entryId === context.state.editingId) {
      return toggleEditing();
    }

    return toggleEditing(portfolioId, entryId, portfolio[entryId]);
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
        <h2 className="title">{name}</h2>
        <ListSearch setFilter={setFilter} />
      </div>
      <Summary data={data} />
      <ListHeader
        setSort={setSort}
        sortBy={state.sortBy}
        inverted={state.inverted}
      />
      <div className="list-wrapper">
        <div className="list">
          {Object.keys(data).map((k) => {
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
