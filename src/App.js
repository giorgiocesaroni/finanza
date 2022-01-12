import React from "react";
import { db } from "./config/Firebase";
import { query, collection, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import Form from "./components/Form";
import List from "./components/List";
import authWithGoogle from "./auth/auth-with-google";
import AuthContext from "./auth/auth-context";

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
      auth: null,
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.subscribeDatabase = this.subscribeDatabase.bind(this);
  }

  componentDidMount() {
    // If user is not logged in, stop
    if (!this.state.auth) return;

    // If user is logged but not database, try subscribing
    if (!this.state.database) return this.setState({ unsubscribeDatabase: this.subscribeDatabase() });

    // Cookies init
  }

  subscribeDatabase() {
    if (this.state.unsubscribeDatabase) return;

    const expensesQuery = query(collection(db, `users/${this.state.auth.user.uid}/expenses`));
    return onSnapshot(expensesQuery, snap => {
      const entries = {};
      snap.forEach(doc => {
        entries[doc.id] = doc.data();
      })
      this.setState({ database: entries });
    });
  }

  unsubscribeDatabase() {
    this.state.unsubscribeDatabase();
    this.setState({ database: {}, unsubscribeDatabase: null });
  }

  async login() {
    const googleAuthCredentials = await authWithGoogle();
    this.setState({ auth: googleAuthCredentials });
    this.setState({ unsubscribeDatabase: this.subscribeDatabase() });
  }

  logout() {
    this.setState({ auth: null, database: {} });
    this.unsubscribeDatabase();
  }

  toggleEditing(state, id) {
    if (state === true && id) {
      return this.setState({ isEditing: state, editingId: id });
    }

    return this.setState({ isEditing: false, editingId: null });
  }

  deleteExpense(id) {
    deleteDoc(doc(db, `users/${this.state.auth.user.uid}/expenses/${id}`));
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
      <AuthContext.Provider value={this.state.auth}>
        <div className="App">
          <Form
            database={this.state.database}
            toggleEditing={this.toggleEditing}
            isEditing={this.state.isEditing}
            editEntry={editEntry}
            editingId={this.state.editingId}
            uid={this.state.auth ? this.state.auth.user.uid : null}
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

        {!this.state.auth ?
          <button className="login" onClick={this.login}>Login with Google</button> :
          <button className="login" onClick={this.logout}>Logout from {this.state.auth.user.displayName}</button>
        }

        <p className="copyright">
          Copyright &copy; {new Date().getFullYear()} Giorgio Cesaroni. All rights
          reserved.
        </p>
      </AuthContext.Provider>
    );
  }
}

App.contextType = AuthContext;

export default App;
