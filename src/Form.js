import React from "react";
import firebase from "./config/Firebase";
import { supportedCategories } from "./App.js";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      date: "",
      amount: "",
      notes: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState(this.props.editEntry);
    }
  }

  handleChange(e) {
    const target = e.target;
    const value =
      target.type === "radio"
        ? target.id
        : Number(target.value) || target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(e) {
    if (e.keyCode === 13) {
      const state = { ...this.state };

      if (!state.date) {
        state.date = String(new Date());
      } else {
        state.date = String(new Date(state.date));
      }
      if (!state.category) {
        state.category = "❓";
      }
      console.log(state);

      if (this.props.isEditing) {
        firebase
          .database()
          .ref("expenses/" + this.props.editId)
          .set(state);
        this.props.toggleEditing(false);
      } else {
        firebase.database().ref("expenses").push(state);
      }

      return this.setState({
        category: "",
        date: "",
        amount: "",
        notes: "",
      });
    }
  }

  render() {
    return (
      <form id="entry-form" onKeyDown={this.handleSubmit}>
        <div className="display crt">
          <div>
            <input
              value={this.state.notes}
              onChange={this.handleChange}
              type="text"
              placeholder="Notes"
              name="notes"
              className="notes"
            />
            <input
              value={this.state.date}
              onChange={this.handleChange}
              type="text"
              placeholder="Date"
              name="date"
              className="date"
            />
          </div>
          <input
            value={this.state.amount}
            onChange={this.handleChange}
            id="display-amount"
            type="number"
            placeholder="$"
            autoFocus
            name="amount"
            className="amount"
          />
        </div>
        <div className="categories-selector">
          {supportedCategories.map((i) => {
            let category = Object.keys(i)[0];
            let emoji = i[category];
            return (
              <label
                htmlFor={category}
                key={category}
                className={
                  this.state.category === emoji ? "highlighted" : undefined
                }
              >
                <span role="img" aria-label={"Emoji of " + category}>
                  {emoji}
                </span>
                <input
                  checked={this.state.category === category}
                  onChange={this.handleChange}
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
  }
}

export default Form;
