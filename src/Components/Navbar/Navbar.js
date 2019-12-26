/*
 * <Navbar/> is....
 */


import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {

  constructor() {
    super();
  }

  // render --------------------------------------------------------------------

  render() {
    /**
     * Render function for <Navbar/>
     *
     * @returns HTML for <Navbar/>
     */

    return (
      <div id="Navbar">
          <img id="Logo" src="./logo.png" draggable="false"></img>
      </div>
    );
  }
}

export default Navbar;