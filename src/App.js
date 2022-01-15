import React from "react";
import Intro from "./components/Intro";
import Form from "./components/Form";
import List from "./components/List";
import { AuthContext, login, logout } from "./auth/auth-with-google";
import { getAuthFromLocalStorage } from "./auth/auth-local-storage";
import { testDatabase } from "./utility/testDatabase";
import { subscribeDatabase } from "./repository/firebase-repository";
import { gsap } from "gsap";

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

    this.listRef = React.createRef();

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

    // GSAP
    gsap.from(this.listRef.current, { "opacity": "0" });
  }

  async handleLogin() {
    const authObject = await login();
    subscribeDatabase(authObject.user.uid, this);
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
    let editEntry = this.state.editingId
      ? this.state.database[this.state.editingId]
      : null;


    // GSAP
    // const listRef = useRef();

    // useEffect(() => {
    //   gsap.to(listRef.current, { rotation: "+=360" });
    // });
    // End GSAP

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

          {!this.state.auth &&
            <>
              <Intro />
            </>
          }

          <List
            ref={this.listRef}
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
