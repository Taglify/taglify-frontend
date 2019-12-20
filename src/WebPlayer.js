/**
 * Spotify WebPlayerSDK Functions.
 * 
 * Hosts functions that involve interacting with the Spotify WebPlayer.
 */


window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQBp6VE9pNTuG6HLi1ZAW4K-fRWegHiE3HmIzFX5uerVCUxdh--J6NM56IGZ4Ty_2W0sF2mPN3d1SAfJSJbhbn5PBBAOIFHW_XSWV6kc2PRD0OOFoX3Svu5pRupMuifX-LEiGPKWWXD9DnbMLDcFN9KEcCbbnaXw';
    const player = new Spotify.Player({
      name: 'Taglify',
      getOAuthToken: cb => { cb(token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();

};

export default window.onSpotifyWebPlaybackSDKReady;
