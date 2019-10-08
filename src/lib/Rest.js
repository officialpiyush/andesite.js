const fetch = require('node-fetch');
const { URL } = require('url');

/**
 * @typedef {Object} TrackInfo Details about a specific track
 * @prop {String} identifier The id of the song
 * @prop {Boolean} isSeekable Whether or not the track is seekable
 * @prop {String} author The author of the song
 * @prop {Number} length The length (in ms) of the song
 * @prop {Boolean} isStream Whether or not the track is a stream
 * @prop {Number} position The position of the track in the array
 * @prop {String} title The title of the song
 * @prop {String} uri The url to get to the song
 */

/**
 * @typedef {Object} Track A track from the andesite-node  REST API
 * @prop {String} track The track id
 * @prop {TrackInfo} info Information about the track
 */

/**
 * @typedef {Object} Playlist
 * @prop {String} name The name of the playlist
 * @prop {String} selected The position of the selected track
 * @prop {Array<Track>} tracks The tracks included in the playlist
 */

class Rest {
	/**
     * The Class to use the Andesie Rest AI for loading tracks and some other stuff
     * @param config - The configuration
     * @param node - The Node Class
     * @constructor
     */
	constructor(config, node) {
		this._config = config;
		this.node = node;
	}

	/**
     * @async
     * Gets information about a track or searches for tracks
     * @param query {String} - The search query to pass to andesite-node
     * @returns {Promise<Array<Track>|Playlist>} The array of tracks returned or the playlist object
     * @since 1.0.0-alpha
     */
	async search(query) {
		const url = new URL(`http://${this._config.host}/loadtracks`);
		url.searchParams.append('identifier', query);

		const response = await fetch(url, {
			headers: {
				Authorization: this._config.password
			}
		}).then(r => r.json());

		try {
			this.node.andesite.addSongInfo(response.tracks);
		} catch (e) { }


		switch (response.loadType) {
			case 'TRACK_LOADED':
			case 'SEARCH_RESULT':
			case 'NO_MATCHES':
				return response.tracks;

			case 'PLAYLIST_LOADED':
				return {
					name: response.playlistInfo.name,
					selected: response.playlistInfo.selectedTrack,
					tracks: response.tracks
				};

			case 'LOAD_FAILED':
				throw new Error('Loading tracks failed');
		}

		return response;
	}
}

module.exports = Rest;
