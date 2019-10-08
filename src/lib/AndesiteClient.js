const { EventEmitter } = require('events');
const Node = require('./Node');

/**
 * @typedef {Object} AndesiteConfig Configuration for Andesite
 * @prop {String} host The host url for the andesite node
 * @prop {String} id The id of the bot account you're using
 */

/**
 * Emitted when there is something you need to send to the Discord gateway
 * @event AndesiteClient#forwardWs
 * @param {String} serverId The id of the server the event is for to make sure it's on the right shard
 * @param {String} data The data to send
 */

class AndesiteClient extends EventEmitter {
	/**
     * Main class of the module. The starting point of using Andesite.
     * @param {AndesiteConfig}
     */
	constructor(config = {}) {
		super();

		this.config = config;
		if (!this.config.host) throw new Error('A host is required for connecting to andesite-node');
		if (!this.config.id) throw new Error('You need to provide an user ID to connect to andesite');

		/**
         * The players that andesiteclient instance has access to, mapped by serverID
         * @type {Map<Number, Player>}
         */
		this.players = new Map();

		this.node = new Node(this.config, this);

		/**
         * A map of all songs fetched, mapped by trackID
         * @type {Map<String, Track>}
         */
		this.songInfo = new Map();
	}

	addSongInfo(songs) {
		songs.forEach(song => this.songInfo.set(song.track, song));
	}

	removePlayer(serverID) {
		this.players.get(serverID).node.players.delete(serverID);
		this.players.delete(serverID);
	}

	/**
     * Joins a voice channel
     * @param {String} serverId The id of the server where the voice channel is
     * @param {String} channelId The id of the channel to join
     * @returns {Player} The player for the channel
     */
	join(serverId, channelId) {
		return this.node.join(serverId, channelId);
	}

	/**
     * Updates the voice state
     * @param {Object} data The parsed "d" property of the JSON returned from the Discord VOICE_STATE_UPDATE event
     */
	voiceStateUpdate(data) {
		try {
			this.players.get(data.guild_id).voiceStateUpdate(data.session_id);
		} catch (e) { }
	}

	/**
     * Updates the voice server
     * @param {Object} data The parsed "d" property of the JSON returned from the Discord VOICE_SERVER_UPDATE event
     */
	voiceServerUpdate(data) {
		try {
			this.players.get(data.guild_id).voiceServerUpdate(data);
		} catch (e) { }
	}
}

module.exports = AndesiteClient;
