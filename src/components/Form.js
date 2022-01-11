import React from "react";
import firebase, { db } from "../config/Firebase";
import { supportedCategories } from "../App.js";
import { doc, addDoc, collection, setDoc, updateDoc } from "firebase/firestore";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      date: "",
      price: "",
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
        price: "",
        notes: "",
      });
    }

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
    console.log(this.state);
  }

  handleSubmit(e) {
    if (e.keyCode === 13) {
      // const this.state = { ...this.state };

      // If no price
      if (!this.state.price || Number(this.state.price) === 0)
        return this.setState({
          category: "",
          date: "",
          price: "",
          notes: "",
        });

      // If no date
      if (!this.state.date) {
        this.state.date = String(new Date());
      } else {
        this.state.date = String(new Date(this.state.date));
      }

      // If no category
      if (!this.state.category) {
        this.state.category = "❓";
      }

      // Submit
      if (this.props.isEditing) {
        console.log(`Editing ${this.state.editingId}`);
        const docRef = doc(db, `users/${this.props.uid}/expenses/${this.props.editingId}`);
        updateDoc(docRef, this.state);
      } else {
        addDoc(collection(db, `users/${this.props.uid}/expenses`), this.state);
      }

      // Reset to initial state after submit
      this.props.toggleEditing();
      return this.setState({
        category: "",
        date: "",
        price: "",
        notes: "",
      });
    }
  }

  render() {
    return (
      <form
        className={
          this.state.price < 0 ? "red" : this.state.price > 0 ? "green" : ""
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
            value={this.state.price}
            onChange={this.handleChange}
            id="display-amount"
            type="number"
            placeholder="$"
            // autoFocus
            name="price"
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
