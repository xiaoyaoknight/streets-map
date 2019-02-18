import React, { Component } from "react";
import "./App.css";

class Menu extends Component {
  showNav() {
    this.props.navChange();
  }

  render() {
    return (
      <div id="menu">
        <button
          className="navbar-toggle"
          type="button"
          onClick={() => this.showNav()}
        >
            选择
        </button>
      </div>
    );
  }
}

export default Menu;