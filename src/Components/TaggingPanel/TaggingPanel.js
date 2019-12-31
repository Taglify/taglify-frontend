/**
 * <TaggingPanel/> allows the user to interact with 
 * 
 */


import React, { Component } from 'react';
import './TaggingPanel.css';

class TaggingPanel extends Component {

  constructor() {
    super();
  }

  // render --------------------------------------------------------------------

  render() {
    /**
     * Render function for <TaggingPanel/>
     *
     * @returns HTML for <TaggingPanel/>
     */

    return (
      <div id='TaggingPanel'>
        <div id='Title'>Tag "{this.props.selectedSong.name}"</div>
        {/* <div id='SongInfo'>
          <div id='SongName'></div>
        </div> */}
        <div id='Tags'></div>
      </div>
    );
  }
}

export default TaggingPanel;
