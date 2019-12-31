/**
 * <ListPanel/> allows the user to select a playlist from their library to pick songs from.
 * 
 * @prop {string}   contentType         decides what type of list items should be rendered
 * 
 * // If content type is PLAYLISTS
 * @prop {array}    playlists           the users playlists
 * @prop {function} setSelectedPlaylist sets the name of the current playlist in <App/>
 * @prop {string}   selectedPlaylistID  the name SpotifyID of the current playlist
 * 
 * // If content type is SONGS
 * @prop {array}    songs               the songs in the currently selected playlist
 * @prop {string}   selectedSongID      the name of the currently selected song
 * @prop {function} setSelectedSong     sets the name of the current song in <App/>
 * 
 */


import React, { Component } from 'react';
import './ListPanel.css';

class ListPanel extends Component {

  constructor(props) {
    super(props);
  }

  // render --------------------------------------------------------------------

  renderListItems () {
    /**
     * Renders the list items in the panel dependent on whether it's elements are
     * songs or playlists.
     * 
     * @todo create a custom component for songs that shows title, artist, album, and duration
     */
    if (this.props.contentType === 'PLAYLISTS') { // Then render playlists
        const playlists = this.props.playlists.map(playlist  =>
            <li className={this.props.selectedPlaylistID===playlist.id?'selected item':'item'} 
                onClick={() => this.props.setSelectedPlaylist(playlist.id)}
            >
                {playlist.name}
            </li>
        );
        return playlists;
    } else if (this.props.contentType === 'SONGS') {
        const songs = this.props.songs.map(song  =>
            <li 
                className={this.props.selectedSong.id===song.track.id?'selected item':'item'}
                onClick={() => this.props.setSelectedSong(song.track)}
            >
                {song.track.name}
            </li>
        );
        return songs;
    }
  }

  render () {
    /**
     * Render function for <ListPanel/>
     *
     * @returns HTML for <ListPanel/>
     */

    return (
      <div id="ListPanel">
          <div id="Title">{this.props.contentType==='PLAYLISTS'? 'Playlists':'Songs'}</div>
          <ul id="Items">
            {this.renderListItems()}
          </ul>
      </div>
    );
  }
}

export default ListPanel;
