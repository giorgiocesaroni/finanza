import React from "react";
import { db } from "../config/firebase";
import { supportedCategories } from "../App.js";
import { doc, addDoc, collection, updateDoc } from "firebase/firestore";
import { AuthContext } from "../auth/auth-with-google";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      date: "",
      price: "",
      notes: "",
    };

    this.focus = this.focus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reset = this.reset.bind(this);
  }

  focus() {
    this.amountInput.focus();
  }

  reset() {
    this.props.toggleEditing();
    return this.setState({
      category: "",
      date: "",
      price: "",
      notes: "",
    });
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
  }

  handleSubmit(e) {

    if (e.keyCode !== 13) return;

    // Reset if no price
    if (!this.state.price) {
      return this.reset();
    };

    // Polished entry
    const entry = {
      category: this.state.category || "❓",
      date: this.state.date ? String(new Date(this.state.date)) : String(new Date()),
      notes: this.state.notes,
      price: this.state.price || 0
    }

    // Submit: create/update on logged user
    if (this.context) {
      console.log("With context");
      if (this.props.isEditing) {
        const docRef = doc(db, `users/${this.props.uid}/expenses/${this.props.editingId}`);
        updateDoc(docRef, entry);
      } else {
        addDoc(collection(db, `users/${this.props.uid}/expenses`), entry);
      }
    } else {
      console.log("Intro");
      // Test mode (intro)
      if (this.props.editingId) {
        this.props.database[this.props.editingId] = entry;
      } else {
        this.props.database[`${Math.random() * 100}`] = entry;
      }
      this.props.setState(this.props.database);
    }

    // Reset to initial state after submit
    this.reset();
  }

  render() {
    return (
      <form
        // className={this.state.price < 0 ? "red" : this.state.price > 0 ? "green" : ""}
        id="entry-form"
        onKeyDown={this.handleSubmit}
      >
        <div className="display">
          <>
            <input
              value={this.state.date}
              onChange={this.handleChange}
              type="text"
              placeholder="Date"
              name="date"
              className="date"
            />
            <input
              value={this.state.notes}
              onChange={this.handleChange}
              type="text"
              placeholder="Notes"
              name="notes"
              className="notes"
            />
          </>
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
          {supportedCategories.map(i => {
            let category = Object.keys(i)[0];
            let emoji = i[category];
            return (
              <label
                onClick={this.focus}
                htmlFor={category}
                key={category}
                className={
                  this.state.category === emoji ? "highlighted" : null
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

Form.contextType = AuthContext;

export default Form;
