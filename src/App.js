import React from "react";
import firebase from "./config/Firebase";
import Form from "./Form";
import List from "./List";

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
      editingId: null,
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
  }

  componentDidMount() {
    this.db = firebase.database().ref("expenses");
    this.db.on("value", (snap) => {
      this.setState({ database: snap.val() });
    });
  }

  toggleEditing(state, id) {
    if (state === true && id) {
      return this.setState({ isEditing: state, editingId: id });
    }
    return this.setState({ isEditing: false, editingId: null });
  }

  deleteExpense(id) {
    this.db.child(id).remove();
  }

  render() {
    const thisMonthDb = Object.keys(this.state.database)
      .filter(
        (e) =>
          new Date(this.state.database[e].date).getMonth() ===
          new Date().getMonth() &&
          new Date(this.state.database[e].date).getYear() ===
          new Date().getYear()
      )
      .reduce((acc, key) => {
        return { ...acc, [key]: this.state.database[key] };
      }, {});

    const lastMonthDb = Object.keys(this.state.database)
      .filter(
        (e) =>
          new Date(this.state.database[e].date).getMonth() ===
          new Date().getMonth() - 1
      )
      .reduce((acc, key) => {
        return { ...acc, [key]: this.state.database[key] };
      }, {});

    const toDateDb = Object.keys(this.state.database).reduce((acc, key) => {
      return { ...acc, [key]: this.state.database[key] };
    }, {});

    let editEntry = this.state.editingId
      ? this.state.database[this.state.editingId]
      : null;

    return (
      <div>
        <div className="App">
          <Form
            database={this.state.database}
            toggleEditing={this.toggleEditing}
            isEditing={this.state.isEditing}
            editEntry={editEntry}
            editingId={this.state.editingId}
          />
          <List
            title="This Month"
            database={thisMonthDb}
            toggleEditing={this.toggleEditing}
            deleteExpense={this.deleteExpense}
            isEditing={this.state.isEditing}
            editingId={this.state.editingId}
          />
          <List
            title="Last Month"
            database={lastMonthDb}
            toggleEditing={this.toggleEditing}
            deleteExpense={this.deleteExpense}
            isEditing={this.state.isEditing}
            editingId={this.state.editingId}
          />
          <List
            title="To Date"
            database={toDateDb}
            toggleEditing={this.toggleEditing}
            deleteExpense={this.deleteExpense}
            isEditing={this.state.isEditing}
            editingId={this.state.editingId}
          />
        </div>
        <p className="copyright">
          Copyright &copy; {new Date().getFullYear()} Giorgio Cesaroni. All rights
          reserved.
        </p>
      </div>
    );
  }
}

export default App;
