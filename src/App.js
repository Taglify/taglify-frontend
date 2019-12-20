/**
 * <App/> is the root React component of Taglify frontend.
 *
 */

import React from 'react';
import logo from './logo.svg';
import './App.css';
import SpotifyWebAPI from 'spotify-web-api-js';

import Sidebar from './Components/Sidebar/Sidebar.js';


// Global variables for Spotify API
window.Spotify = null;
let SpotifyAPI = new SpotifyWebAPI();


// =============================================================================
// <App/>
// =============================================================================

class App extends React.Component {

  constructor () {
    super();

    // Check if the url contains Spotify login credentials.
    const url_params = this.getURLParameters();
    let token = url_params.access_token;

    this.state = {
      logged_in : token? true : false,    // true if <App/> can use user's Spotify
      token     : token,                  // access token given by Spotify for using the API

      currentPage: "untaggedSongs"        // indicates the page the user is currently on
    }

    this.playerExistsInterval = null;
  }

  componentDidMount() {
    if (this.state.token) {
      SpotifyAPI.setAccessToken(this.state.token);
      this.createPlayer();
    }
  }

  // Spotify Web SDK Functions -------------------------------------------------
  /**
    * Functions that are necessary for using the Spotify Web SDK
    *
  */

  getURLParameters() {
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
      clearInterval(this.playerExistsInterval);
    }
  }

  createPlayer () {
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

  // onClick -------------------------------------------------------------------


  onClick_selectPage = (page) => {
    /**
     * function selects a page, used by <Sidebar/> for navigation.
     * page has to be in set [playlists, taggedSongs, untaggedSongs], otherwise function does nothing
     *
     * @param   string    page        selects the given page name, assuming it is valid
     */

     if (["playlists","taggedSongs","untaggedSongs"].indexOf(page) >= 0 && this.state.currentPage !== page) {
       this.setState({currentPage: page});
     }
  }

  // Render --------------------------------------------------------------------
  /**
   * Renders the <App/> Component
   */

  render() {
    return (
      <div id="App">
        <div id="sidebar_container">
          <Sidebar
            selectedOption={this.state.currentPage}
            onClick_selectPage={this.onClick_selectPage}
          />
        </div>
        <div id="page_container">
          <button onClick={() => this.logIn()}>LOGIN</button>
        </div>
      </div>
    );
  }
}

export default App;
