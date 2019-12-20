import React from 'react';
import logo from './logo.svg';
import './App.css';
import SpotifyWebAPI from 'spotify-web-api-js';


// SPOTIFY API GLOBALS --------------------------------------------------------------------------//
window.Spotify = null;
let SpotifyAPI = new SpotifyWebAPI();

class App extends React.Component {

  constructor () {
    super();

    // Check if the url contains Spotify login credentials.
    const url_params = this.getURLParameters();
    let token = url_params.access_token;

    this.state = {
      logged_in : token? true : false,
      token     : token,
    }

    this.playerExistsInterval = null;
  }

  componentDidMount() {
    if (this.state.token) {
      SpotifyAPI.setAccessToken(this.state.token);
      this.createPlayer();
    }
  }

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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button onClick={() => this.logIn()}>LOGIN</button>
        </header>
      </div>
    );
  }
}

export default App;
