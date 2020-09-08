import React from "react";
import firebase from "./config/Firebase";
import Form from "./Form";
import ThisMonth from "./ThisMonth";
import LastMonth from "./LastMonth";
import PreviousMonths from "./PreviousMonths";

// Currently supported categories
export const supportedCategories = [
  { pizza: "🍕" },
  { gas: "⛽️" },
  { utility: "⚙️" },
  { groceries: "🥑" },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      database: {},
      isEditing: false,
      editId: null,
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
  }

  componentDidMount() {
    // This sets the current state to the database
    this.db = firebase.database().ref("expenses");
    this.db.on("value", (snap) => {
      this.setState({ database: snap.val() });
    });
  }

  toggleEditing(state, id) {
    if (state === true && id) {
      return this.setState({ isEditing: state, editId: id });
    }
    return this.setState({ isEditing: false, editId: null });
  }

  deleteExpense(id) {
    this.db.child(id).remove();
  }

  render() {
    let editEntry = this.state.editId
      ? this.state.database[this.state.editId]
      : null;

    return (
      <div className="App">
        <Form
          database={this.state.database}
          toggleEditing={this.toggleEditing}
          isEditing={this.state.isEditing}
          editEntry={editEntry}
          editId={this.state.editId}
        />
        <ThisMonth
          database={this.state.database}
          toggleEditing={this.toggleEditing}
          deleteExpense={this.deleteExpense}
        />
        <LastMonth
          database={this.state.database}
          toggleEditing={this.toggleEditing}
          deleteExpense={this.deleteExpense}
        />
        <PreviousMonths
          database={this.state.database}
          toggleEditing={this.toggleEditing}
        />
      </div>
    );
  }
}

export default App;
