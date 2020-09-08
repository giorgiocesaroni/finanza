import React from "react";
import { monthDay } from "./utilities";
import Summary from "./Summary";

class LastMonth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(k) {
    if (k.target.id) {
      this.props.deleteExpense(k.target.id);
      console.log("deleted");
    }
    const id = k.target.parentElement.id;
    this.props.toggleEditing(true, id);
  }

  render() {
    const db = this.props.database || [];
    const thisMonthDb = {};
    for (let key of Object.keys(db)) {
      if (new Date(db[key].date).getMonth() === new Date().getMonth() - 1) {
        thisMonthDb[key] = db[key];
      }
    }

    return (
      <div className="element">
        <h2>Last Month</h2>
        <Summary database={thisMonthDb} />
        <div className="list">
          {Object.keys(thisMonthDb).map((k) => {
            return (
              <div key={k}>
                <div className="entry" id={k} onClick={this.handleClick}>
                  <span className="icon">{db[k].category}</span>
                  <p>{monthDay(db[k].date)}</p>
                  <p>{db[k].amount}</p>
                  <p>{db[k].notes}</p>
                  <span
                    id={k}
                    onClick={this.handleClick}
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

export default LastMonth;
