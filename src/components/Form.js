import React from "react";
import firebase from "../config/Firebase";
import { supportedCategories } from "../App.js";

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
    this.focus = this.focus.bind(this);
  }

  focus() {
    this.amountInput.focus();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isEditing && !this.props.isEditing) {
      this.setState({
        category: "",
        date: "",
        amount: "",
        notes: "",
      });
    }

    if (prevProps !== this.props) {
      this.setState(this.props.editEntry);
    }
  }

  handleChange(e) {
    console.log("handleChange", e);
    const target = e.target;
    const value =
      target.type === "radio"
        ? target.id
        : Number(target.value) || target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
    console.log(this.state);
  }

  handleSubmit(e) {
    if (e.keyCode === 13) {
      console.log("handleSubmit");
      const state = { ...this.state };

      if (!state.amount || Number(state.amount) === 0)
        return this.setState({
          category: "",
          date: "",
          amount: "",
          notes: "",
        });

      if (!state.date) {
        state.date = String(new Date());
      } else {
        state.date = String(new Date(state.date));
      }

      if (!state.category) {
        state.category = "❓";
      }

      if (this.props.isEditing) {
        firebase
          .database()
          .ref("expenses/" + this.props.editingId)
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
      <form
        className={
          this.state.amount < 0 ? "red" : this.state.amount > 0 ? "green" : ""
        }
        id="entry-form"
        onKeyDown={this.handleSubmit}
      >
        <div className="display">
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
            ref={(ref) => {
              this.amountInput = ref;
            }}
            value={this.state.amount}
            onChange={this.handleChange}
            id="display-amount"
            type="number"
            placeholder="$"
            // autoFocus
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
                onClick={this.focus}
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
