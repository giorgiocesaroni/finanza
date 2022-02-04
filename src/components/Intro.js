import React from "react";
import { List } from "./List";

export class Intro extends React.Component {
  render() {
    return (
      <>
        <section className="element">
          <h2>Welcome to Finanza</h2>
          <p>
            Finanza is a Progressive Web App that helps you organize your
            personal and business spendings.
          </p>
          <p>
            It's built with the newest and safest technologies, securing your
            data with maximum privacy.
          </p>
        </section>
        <section className="element tutorial">
          <span>
            <h3>Add</h3>
            <p>Tap a category 🍕 and press "enter" to submit.</p>
          </span>
          <span>
            <h3>Edit</h3>
            <p>Tap on an entry, then press "enter" to commit.</p>
          </span>
          <span>
            <h3>Delete</h3>
            <p>Swipe the entry to the left to reveal the ❌ button.</p>
          </span>
        </section>
        <List />
      </>
    );
  }
}
