import React from "react";
import monthDay from "../utility/monthDay";
import Summary from "./Summary";
import accounting from "../utility/accounting";
import { AuthContext } from "../auth/auth-with-google";
import { deleteExpense } from "../repository/firebase-repository";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inverted: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.sortDb = this.sortDb.bind(this);
    this.setSort = this.setSort.bind(this);
  }

  handleDelete(id) {
    this.props.toggleEditing();
    return deleteExpense(this.context.user.uid, id);
  }

  handleClick(k) {
    if (k.target.className.includes("delete")) return;

    const id = k.target.parentElement.id;

    if (id === this.props.editingId) {
      this.props.toggleEditing(false);
      this.setState({ isEditing: false, editingId: null });
      return;
    }

    this.props.toggleEditing(true, id);
    this.setState({ isEditing: true, editingId: id });
  }

  sortDb(db) {
    let filter = this.state.filter;
    let filteredKeys = Object.keys(db).sort((a, b) => {
      if (filter === "date") {
        if (new Date(db[a][filter]) < new Date(db[b][filter])) return -1;
        if (new Date(db[a][filter]) > new Date(db[b][filter])) return 1;
      }
      if (db[a][filter] < db[b][filter]) return -1;
      if (db[a][filter] > db[b][filter]) return 1;
      return 0;
    });

    if (this.state.inverted) {
      filteredKeys = filteredKeys.reverse();
    }

    let sortedDb = {};
    for (let key of filteredKeys) {
      sortedDb[key] = db[key];
    }

    return sortedDb;
  }

  setSort(e) {
    if (e.target.innerHTML.toLowerCase() === this.state.filter) {
      return this.setState((prev) => ({ inverted: !prev.inverted }));
    }
    this.setState({ filter: e.target.innerHTML.toLowerCase() });
  }

  render() {
    const db = !this.state.filter
      ? this.props.database
      : this.sortDb(this.props.database);

    const hasDb = this.props.database ? true : false;

    if (!this.props.database) return null;

    return (
      <div className="element">
        <h2>{this.props.title}</h2>
        <Summary database={db} />
        <div onClick={this.setSort} className="description">
          <p>Category</p>
          <p>Date</p>
          <p>Amount</p>
          <p>Notes</p>
        </div>
        <div className="list">
          {this.props.database && Object.keys(db).map((k) => {
            return (
              <div
                className={
                  this.props.isEditing && this.props.editingId === k
                    ? "selected"
                    : ""
                }
                key={k}
              >
                <div className="entry" id={k} onClick={this.handleClick}>
                  <span className="icon">{db[k].category}</span>
                  <p>{monthDay(db[k].date)}</p>
                  <p>{accounting.formatMoney(db[k].price)}</p>
                  <p>{db[k].notes}</p>
                  <span
                    role="img"
                    aria-label="emoji"
                    id={k}
                    onClick={() => this.handleDelete(k)}
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
}

List.contextType = AuthContext;

export default List;
