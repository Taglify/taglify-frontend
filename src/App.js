/**
 * <App/> is the root React component of Taglify frontend.
 *
 */

import React from 'react';
import './App.css';
import SpotifyWebAPI from 'spotify-web-api-js';

import Navbar        from './Components/Navbar/Navbar.js';
import PlaylistPanel from './Components/ListPanel/ListPanel.js';


// Global variables for Spotify API
window.Spotify = null;
let SpotifyAPI = new SpotifyWebAPI();


// =============================================================================
// <App/>
// =============================================================================

class App extends React.Component {

  // CONSTRUCTOR -------------------------------------------------------------//
  constructor () {
    super();

    // Check if the url contains Spotify login credentials.
    const url_params = this.getURLParameters();
    let token = url_params.access_token;

    this.state = {
      logged_in : token? true : false,    // true if <App/> can use user's Spotify
      token     : token,                  // access token given by Spotify for using the API

      playlists: [],                      // the users playlists
      selectedPlaylistsSongs: [],         // the currently selected playlist's songs
      
      selectedPlaylistID: "",             // the current playlist id selected in PLAYLISTS <ListPanel/>
      selectedSongID: "",                 // the current song id selected in SONGS <ListPanel/>

      currentPage: "untaggedSongs"        // indicates the page the user is currently on
    }
    
    if (token) {
      SpotifyAPI.setAccessToken(this.state.token);

      // Get the users playlists and store in state
      SpotifyAPI.getUserPlaylists().then(response => {
        this.setState({playlists: response.items});
      });
    }

    this.playerExistsInterval = null;
  }

  componentDidMount () {
    if (this.state.logged_in) {
      this.createPlayer();
    }
  }

  getURLParameters () {
    /**
     * Get the parameters from the url and return them as a hashmap object.
     *
     * @returns {object}
     */
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }


  playerExists () {
    /**
     * Checks if the a player has been created through the SpotifyPlayerSDK script included in
     * in public/index.html and initializes it if so.
     *
     * @see index.html
     */

    if (window.Spotify !== null) {
      let token = this.state.token;
      window.WebPlayer = new window.Spotify.Player({
        name: 'Taglify Web Player',
        getOAuthToken: cb => { cb(token); }
      });

      // Error handling
      window.WebPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
      window.WebPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
      window.WebPlayer.addListener('account_error',        ({ message }) => { console.error(message); });
      window.WebPlayer.addListener('playback_error',       ({ message }) => { console.error(message); });

      // Playback status updates
      window.WebPlayer.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      window.WebPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      window.WebPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player
      window.WebPlayer.connect();

      // Delete Interval
      clearInterval (this.playerExistsInterval);
    }
  }

  createPlayer () {
    /**
     * Checks if the user is logged in and trys to create a SpotifyWebSDK player
     * until it succeeds.
     */
    if (this.state.logged_in === true) {
      this.playerExistsInterval = setInterval( () => this.playerExists(), 3000 );
    }
  }

  logIn () {
    /**
     * Naviages to the Taglify auth server forwards to Spotify's login page.
     */
    window.open('http://localhost:8888', "_self");
  }

  // onClick ----------------------------------------------------------------//


  onClick_selectPage = (page) => {
    /**
     * function selects a page, used by <Sidebar/> for navigation.
     * page has to be in set [playlists, taggedSongs, untaggedSongs], otherwise function does nothing
     *
     * @param {string} page selects the given page name, assuming it is valid
     */

    if (["playlists","taggedSongs","untaggedSongs"].indexOf(page) >= 0 && this.state.currentPage !== page) {
      this.setState({currentPage: page});
    }
  }

  setSelectedPlaylist = (playlist) => {
    /**
     * Selects a playlist contained within <Panel/> with type PLAYLISTS and updates
     * the currently selected playlist in this.state.
     * 
     * @param {string} playlist the playlist to update.
     */

    this.setState({
         selectedPlaylistID: playlist,
         selectedSongID: '',
    });

    // Store the contents of the playlist to this.state
    SpotifyAPI.getPlaylist(playlist).then(response => {
      console.log(response);
      this.setState({selectedPlaylistsSongs: response.tracks.items})
    });

  }

  setSelectedSong = (song) => {
    /**
     * Selects a song contained within <Panel/> with type SONGS and updates
     * the currently selected song in this.state.
     * 
     * @param {string} song the playlist to update.
     */

    this.setState({selectedSongID: song});

  }

  // Render -----------------------------------------------------------------//
  /**
   * Renders the <App/> Component
   */

  render () {
    console.log(this.state);

    if (this.state.logged_in) {
      return (
        <div id="App">
          <div id="navbar_container">
            <Navbar/>
          </div>
          <div id="page_container">
            
            <div id="playlists_container">
              <PlaylistPanel
                contentType='PLAYLISTS'
                playlists={this.state.playlists}
                selectedPlaylistID={this.state.selectedPlaylistID}
                setSelectedPlaylist={this.setSelectedPlaylist}
              />
            </div>

            <div 
              id="songs_container"
              className={this.state.selectedSongID?'retracted':'expanded'}
            >
              <PlaylistPanel
                contentType='SONGS'
                songs={this.state.selectedPlaylistsSongs}
                selectedSongID={this.state.selectedSongID}
                setSelectedSong={this.setSelectedSong}
              />
            </div>

            <div id="tagging_container">
              {/**
               * @todo create tagging component
               */}
            </div>

          </div>
        </div>
      )
    } else {
      return (
        <div id="App">
          <div id="navbar_container">
            <Navbar/>
          </div>
          <div id="page_container">
            <button onClick={() => this.logIn()}>LOGIN</button>
          </div>
        </div>
      );
    }
  }
}

export default App;
