import React from "react";
import accounting from "accounting";

export default function Summary(props) {
  const expenses = Object.keys(props.database)
    .filter((key) => props.database[key].amount > 0)
    .map((key) => props.database[key].amount)
    .reduce((a, b) => a + b, 0);

  const income = Object.keys(props.database)
    .filter((key) => props.database[key].amount < 0)
    .map((key) => props.database[key].amount)
    .reduce((a, b) => a + b, 0);

  const balance = -income - expenses;

  return (
    <ul className="summary">
      <li>
        <h3>Expenses</h3>
        <p>{accounting.format(expenses)}</p>
      </li>
      <li>
        <h3>Income</h3>
        <p>{accounting.format(income)}</p>
      </li>
      <li>
        <h3>Balance</h3>
        <p>{accounting.format(balance)}</p>
      </li>
    </ul>
  );
}
