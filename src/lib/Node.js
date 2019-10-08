const ws = require('ws');
const Rest = require('./Rest');
const Player = require('./Player');

/**
 * @typedef {Object} JoinOptions Options to join a voice channel with
 * @prop {Boolean} self_deaf Whether or not to join the channel deafened
 * @prop {Boolean} self_mute Whether or not to join the channel muted
 */

class Node {
	/**
     * An interface to interact with andesite node.
     */
	constructor(config, andesite) {
		this.config = config;
		if (!this.config.host) throw new Error('A host is required for connecting to andesite-node');
		if (!this.config.id) throw new Error('You need to provide an user ID to connect to andesite');

		this.andesite = andesite;
		this.rest = new Rest(config, this);

		this.ws = new ws(`ws://${this.config.host}/websocket`, {
			headers: {
				'Authorization': config.password,
				'User-Id': config.id
			}
		});

		this.ws.on('message', this._handlMessage.bind(this));
		this.ws.on('close', this._handleClose.bind(this));

		this.stats = {};
		this.players = new Map();
	}

	_handlMessage(message) {
		try {
			message = JSON.parse(message);
		} catch (e) {
			return null;
		}

		switch (message.op) {
			case 'playerUpdate':
				this.players.get(message.guildId).update(message.state);
				break;

			case 'stats':
				delete message.op;
				this.stats = message;
				break;

			case 'event':
				try {
					this.players.get(message.guildId).event(message.type, message);
				} catch (e) { }
				break;
		}
	}

	_handleClose() {
		this._destory();
	}

	voiceServerUpdate(event, guildId, sessionId) {
		const packet = {
			op: 'voiceUpdate',
			guildId,
			sessionId,
			event
		};

		this.ws.send(JSON.stringify(packet));
	}

	/**
     * Joins a channel
     * @param {String} serverId The server id where the voice channel to join is
     * @param {String} channelId The id of the voice channel to join
     * @param {JoinOptions} options The options to join with
     * @returns {Player} The player for the voice channel
     */
	join(serverId, channelId, options = {}) {
		const player = new Player(this, serverId);

		const packet = {
			op: 4,
			d: Object.assign({
				self_deaf: false,
				guild_id: serverId,
				channel_id: channelId,
				self_mute: false
			}, options)
		};

		this.stats.players++;

		this.players.set(serverId, player);
		this.andesite.players.set(serverId, player);
		this.andesite.emit('forwardWs', serverId, JSON.stringify(packet));

		return player;
	}

	/**
     * Destroys the node
     */
	destroy() {
		this.players.forEach(p => p.destroy(true));
		this.andesite.removeNode(this);
	}
}

module.exports = Node;
