import React from "react";
import Intro from "./components/Intro";
import Form from "./components/Form";
import List from "./components/List";
import { AuthContext, login, logout } from "./auth/auth-with-google";
import { getAuthFromLocalStorage } from "./auth/auth-local-storage";
import { testDatabase } from "./utility/testDatabase";
import { subscribeDatabase } from "./repository/firebase-repository";

// Currently supported categories
export const supportedCategories = [
  { pizza: "🍕" },
  { gas: "⛽️" },
  { utility: "⚙️" },
  { groceries: "🥑" },
  { income: "💵" },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      database: testDatabase,
      isEditing: false,
      editingId: null,
      auth: null,
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    // If user is not logged in and there's local storage auth
    const authFromLocalStorage = getAuthFromLocalStorage();
    if (!this.state.auth && authFromLocalStorage) {
      this.setState({
        auth: getAuthFromLocalStorage(),
      });
      subscribeDatabase(authFromLocalStorage.user.uid, this);
    };
  }

  async handleLogin() {
    const authObject = await login();
    subscribeDatabase(authObject.user.uid, this)
    return this.setState({
      auth: authObject
    });
  }

  handleLogout() {
    logout();
    this.setState({
      auth: null,
      database: testDatabase
    });
  }

  toggleEditing(state, id) {
    if (state === true && id) {
      return this.setState({ isEditing: state, editingId: id });
    }

    return this.setState({ isEditing: false, editingId: null });
  }

  render() {
    // const thisMonthDb = Object.keys(this.state.database)
    //   .filter(
    //     (e) =>
    //       new Date(this.state.database[e].date).getMonth() ===
    //       new Date().getMonth() &&
    //       new Date(this.state.database[e].date).getYear() ===
    //       new Date().getYear()
    //   )
    //   .reduce((acc, key) => {
    //     return { ...acc, [key]: this.state.database[key] };
    //   }, {});

    // const lastMonthDb = Object.keys(this.state.database)
    //   .filter(
    //     (e) =>
    //       new Date(this.state.database[e].date).getMonth() ===
    //       new Date().getMonth() - 1
    //   )
    //   .reduce((acc, key) => {
    //     return { ...acc, [key]: this.state.database[key] };
    //   }, {});

    // const toDateDb = Object.keys(this.state.database).reduce((acc, key) => {
    //   return { ...acc, [key]: this.state.database[key] };
    // }, {});

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
            setState={this.setState}
          />
          {/* <List
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
          /> */}

          {!this.state.auth &&
            <>
              <Intro />
            </>
          }

          <List
            title="Personal"
            database={this.state.database}
            toggleEditing={this.toggleEditing}
            isEditing={this.state.isEditing}
            editingId={this.state.editingId}
            setState={this.setState}
          />
        </div>

        {!this.state.auth ?
          <button className="login" onClick={this.handleLogin}>Login with Google</button> :
          <button className="login" onClick={this.handleLogout}>Logout from {this.state.auth.user.displayName}</button>
        }

        <p className="copyright">
          Copyright &copy; {new Date().getFullYear()} Giorgio Cesaroni. All rights
          reserved.
        </p>
      </AuthContext.Provider>
    );
  }
}

export default App;
