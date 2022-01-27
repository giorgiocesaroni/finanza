import React from "react";
import accounting from "../utility/accounting";

export default function Summary(props) {
  const expenses = Object.keys(props.data)
    .filter((key) => props.data[key].category !== '💵')
    .map((key) => props.data[key].price)
    .reduce((a, b) => a + b, 0);

  const income = Object.keys(props.data)
    .filter((key) => props.data[key].category === '💵')
    .map((key) => props.data[key].price)
    .reduce((a, b) => a + b, 0);

  const balance = income - expenses;

  return (
    <ul className="summary">
      <li>
        <h3>Expenses</h3>
        <p>{accounting.formatMoney(expenses)}</p>
      </li>
      <li>
        <h3>Income</h3>
        <p>{accounting.formatMoney(income)}</p>
      </li>
      <li>
        <h3>Balance</h3>
        <p>{accounting.formatMoney(balance)}</p>
      </li>
    </ul>
  );
}
