const { EventEmitter } = require('events');
const Queue = require('./Queue');

/**
 * @typedef {Object} PlayerState The state of a andesite-node player
 * @prop {Number} position The position of the player in the current playing track
 * @prop {Number?} time The UNIX timestamp from the andesite-node server
 * @prop {Number} localTime The local UNIX timestamp
 */

/**
 * @typedef {String} EndReason The reason a track ended, either "FINISHED", "LOAD_FAILED", "STOPPED", "REPLACED", "CLEANUP"
 */

/**
 * @typedef {Object} PlayOptions The options to play a song with
 * @prop {Number} [startTime=0] The time to start the track from
 * @prop {Number} [endTime=Total Length] The time to end the track at
 */


class Player extends EventEmitter {
	/**
     * Interface to play music to a channel.
     */
	constructor(node, serverID) {
		super();

		this.node = node;

		/**
         * The Server's ID for which the player is created.
         * @type {String}
         */
		this.serverID = serverID;
		this.sessionID = null;

		/**
         * The Queue Playing (if it exists)
         * @type {Queue?}
         */

		this.setDefaults();
	}

	setDefaults() {
		/**
         * The currently playing track. (Would be null if nothing is playing)
         * @type {Track?}
         */
		this.nowPlaying = null;
		this.next = null;

		/**
         * The curent state of the player.
         * @type {PlayerState?}
         */
		this.state = null;

		/**
         * Wheather the music is currently paused or not.
         * @type {Boolean}
         */
		this.paused = false;

		/**
         * The current volume of the player.
         * @type {Number}
         */
		this.volume = 100;
	}

	update(state) {
		/**
         * Fires when andesite-node sends information about the current state.
         * @event Player#update`
         * @param {PlayerState} - The player's state.
         */

		this.emit('update', state);

		this.state = Object.assign(state, { localTime: Date.now() });
	}

	async event(type, data) {
		data.track = this.nowPlaying;
		this.nowPlaying = this.next;

		switch (type) {
			case 'TraclEndEvent':
				if (data.reason !== 'REPLACED') this.setDefaults();

				/**
                 * Fires when the current track (or song) ends.
                 * @event Player#trackEnd
                 * @param {Track} track - The track that ended.
                 * @param {EndReason} reason - The reason why the track changed.
                 *@param {Boolean} playNext - Whether more songs should have been played after this.
                 */
				this.emit('trackEnd', data.track, data.reason, ['FINISHED', 'LOAD_FAILED'].indexOf(data.EndReason) !== -1);
				break;

			case 'TrackExceptionEvent':
				this.setDefaults();

				/**
                 * Fires when there is an error playing the track.
                 * @event Player#trackError
                 * @param {Track} track - The track which caused error.
                 * @param {String} error - The error from andesite-node.
                 */
				this.emit('trackError', data.track, data.error);
				break;

			case 'TrackStuckEvent':
				/**
                 * Fires when a track gets stuck.
                 * @event Player#trackStuck
                 * @param {Track} track - The track which is stuck.
                 * @param {Number} thresholdMS - The threshold for being stuck.
                 */
				this.emit('trackStuck', data.track, data.thresholdMS);
				break;

			case 'WebSocketClosedEvent':
				/**
             * Fires when discord websockets are closed.
             * @event Player#wsClosed
             * @param {Number} code - The error code from discordapp.
             * @param {String} reason - The reason why the connection was closed.
             * @param {Boolean} byRemote - Whether teh connection was closed by remote source or not.
             */
				this.emit('wsClosed', data.code, data.reason, data.byRemote);
				this.destory();
				break;
		}
	}

	/**
     * The position in the current playing song in ms ( -1 if no song is playing ).
     * @type {Number}
     */
	get position() {
		if (!this.nowPlaying) return -1;

		return this.state.position + (Date.now() - this.state.localTime);
	}

	/**
     * Plays the song the current player.
     * @param {String | Queue} track - The track ID from andesite to play or a {@link Queue} class to play a queue.
     * @param {PlayOptions} [options = {}] - The options to play song with.
     * @returns {Track} - The song played.
     */
	play(track, options) {
		if (track instanceof Queue) {
			return track.start(this);
		}

		const packet = Object.assign({
			op: 'play',
			guildID: this.serverID,
			track
		}, options);

		this.next = this.node.andesite.songInfo.get(track);

		if (!this.nowPlaying) this.nowPlaying = this.next;

		this.node.ws.send(JSON.stringify(packet));
		return this.next;
	}

	/**
     * Stops the music.
     * @returns {Boolean} Returns true if the music was stopped, false if it wasn't playing.
     */
	stop() {
		if (!this.nowPlaying) return false;

		const packet = {
			op: 'stop',
			guildID: this.serverID
		};

		this.node.ws.send(JSON.stringify(packet));
		return true;
	}

	/**
     * Pauses the music.
     * @returns {Boolean} Returns false if music is already paused and true if it was successfully paused.
     */
	pause() {
		if (this.paused) return false;

		const packet = {
			op: 'pause',
			guildID: this.serverID,
			pause: true
		};

		this.paused = true;
		this.node.ws.send(JSON.stringify(packet));
		return true;
	}

	/**
     * Resumes the music.
     * @returns {Boolean} Return false is music is already playing, and true is successfully resumed
     */
	resume() {
		if (!this.paused) return false;

		const packet = {
			op: 'pause',
			guildID: this.serverID,
			pause: false
		};

		this.paused = false;
		this.node.ws.send(JSON.stringify(packet));
		return true;
	}

	/**
     * Seeks to a position in the currently playing track by a time in ms
     * @param {Number} position - The position in the song to seek.
     * @returns {Boolean} Returns false if no music is playing, returns true is position is updated.
     */
	seek(position) {
		if (!this.nowPlaying) return false;

		const packet = {
			op: 'seek',
			guildID: this.serverID,
			position
		};

		this.state = { position, time: null, localTime: Date.now() };
		this.node.ws.send(JSON.stringify(packet));
		return true;
	}

	/**
     * Sets the volume of the music.
     * @param {Number} voulme - The volume to set (Should be between 0 & 1000)
     * @returns {Number} The new volume
     */
	setVolume(volume) {
		if (volume < 0) volume = 0;
		if (volume > 1000) volume = 1000;

		const packet = {
			op: 'volume',
			guildId: this.serverID,
			volume
		};

		this.volume = volume;
		this.node.ws.send(JSON.stringify(packet));
		return volume;
	}

	// TODO
	updateMixer(guildId, options = {}) {
		const packet = {
			op: 'mixer',
			guildId
		};

		if (options.enable) {
			packet.enable = options.enable;
		}
		if (options.players) {

		}
	}

	updateFilters(guildId, options = {}) {
		const packet = {
			op: 'filters',
			guildId
		};

		if (options.equalizer) {
			packet.equalizer = options.equalizer;
		}
		if (options.karaoke) {
			packet.karaoke = options.karaoke;
		}
		if (options.timescale) {
			packet.timescale = options.timescale;
		}
		if (options.tremolo) {
			packet.tremolo = options.tremolo;
		}
		if (options.vibrato) {
			packet.vibrato = options.vibrato;
		}
		if (options.volume) {
			packet.volume = options.volume;
		}

		this.node.ws.send(JSON.stringify(packet));
		return true;
	}

	/**
     * Destroys the player
     * @returns {Boolean} Returns true if the player has been destroyed successfully
     */
	destroy(node) {
		const packet = {
			op: 4,
			d: {
				self_deaf: false,
				guild_id: this.serverID,
				channel_id: null,
				self_mute: false
			}
		};

		const andesitePacket = {
			op: 'destroy',
			guildId: this.serverID
		};

		this.node.stats.players--;
		if (!node) this.node.ws.send(JSON.stringify(andesitePacket));

		this.node.andesite.emit('forwardWs', this.serverID, JSON.stringify(packet));
		this.node.andesite.removePlayer(this.serverID);

		return true;
	}
}

module.exports = Player;
