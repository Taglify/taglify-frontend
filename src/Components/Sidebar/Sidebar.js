/**
 * <Sidebar/> is a sidebar that lets the user navigate to different pages on the website.
 *
 * From the sidebar, the user can navigate to:
 *  - tagged songs
 *  - untagged songs
 *  - playlists
 *
 * The sidebar is narrow by default and expands when hovered over
 */


import React, { Component } from 'react';
import './Sidebar.css';

class Sidebar extends Component {

  constructor() {
    super();

    this.state = {
      expanded: false
    }
  }

  // render --------------------------------------------------------------------


  renderNavigationOption = (optionName, renderText = false) => {
    /**
     * renders a nagivation option in the sidebar for user to select (ex: playlists page)
     *
     * @param string  optionName      name of the option being rendered
     * @param bool    [renderText]    if this is true, render version w/ label
     *
     * @returns HTML for a row in the sidebar
     */

     // because unicode is only easy to use if embedded directly into HTML, pick icon object
     let iconObj, label;
     if (optionName === "playlists") {
       iconObj = <h1 className="navbar_icon" id="playlist_icon">&#9654;</h1>;        // a play button
       label = (renderText) ? "Playlists" : "";
     } else if (optionName === "taggedSongs") {
       iconObj = <h1 className="navbar_icon">&#9733;</h1>;                           // a filled in star
       label = (renderText) ? "Tagged Songs" : "";
     } else if (optionName === "untaggedSongs") {
       iconObj = <h1 className="navbar_icon">&#9734;</h1>;                           // an unfilled star
       label = (renderText) ? "Untagged Songs" : "";
     }

     if (optionName === this.props.selectedOption) {
       return (
         <div className="navigation_option_row selected_border">
           {iconObj}
           <h3>{label}</h3>
         </div>
       );
     } else {
       return (
         <div
           className="navigation_option_row unselected_border"
           onClick={() => this.props.onClick_selectPage(optionName)}>
           {iconObj}
           <h3>{label}</h3>
         </div>
       );
     }

  }

  renderTaglifyLogo = (renderText = false) => {
    /**
     * renders the Taglify Logo at the top of the sidebar
     *
     * @param bool    [renderText]       if this is true, render version w/ string "Taglify"
     * @returns HTML for the logo on the sidebar
     */

    let taglifyText = (renderText) ? <h1>Taglify</h1> : <h1> </h1>;
    return (
      <div id="taglify_logo_container">
        <div id="content">
          {taglifyText}
          <h1>&#9733;</h1>
        </div>
        <svg height="60" width="40">
          <polygon points="0,0 0,60 30,30" id="triangle" />
        </svg>
      </div>
    );
  }



  render() {
    /**
     * Render function for <Sidebar/>.
     * If hovered over, will render expanded sidebar as an absolute div that has full names of navigation options
     * Otherwise, will render a retracted sidebar (logos only, fits in parent alloted div)
     *
     * @returns HTML for <Sidebar/>
     */


     if (this.state.expanded) {
       return (
         <div id="Sidebar">
           <div id="expanded" onMouseLeave={() => this.setState({expanded: false})}>
             {this.renderTaglifyLogo(true)}
             {this.renderNavigationOption("playlists", true)}
             {this.renderNavigationOption("taggedSongs", true)}
             {this.renderNavigationOption("untaggedSongs", true)}
           </div>
         </div>
       );

     } else {
       return (
         <div id="Sidebar" onMouseEnter={() => this.setState({expanded: true})}>
           <div id="retracted">
             {this.renderTaglifyLogo()}
             {this.renderNavigationOption("playlists")}
             {this.renderNavigationOption("taggedSongs")}
             {this.renderNavigationOption("untaggedSongs")}
           </div>
         </div>
       );
     }

  }
}

export default Sidebar;
