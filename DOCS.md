## Classes

<dl>
<dt><a href="#AndesiteClient">AndesiteClient</a></dt>
<dd></dd>
<dt><a href="#Node">Node</a></dt>
<dd></dd>
<dt><a href="#Player">Player</a></dt>
<dd></dd>
<dt><a href="#Queue">Queue</a></dt>
<dd></dd>
<dt><a href="#Rest">Rest</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#AndesiteConfig">AndesiteConfig</a> : <code>Object</code></dt>
<dd><p>Configuration for Andesite</p>
</dd>
<dt><a href="#JoinOptions">JoinOptions</a> : <code>Object</code></dt>
<dd><p>Options to join a voice channel with</p>
</dd>
<dt><a href="#PlayerState">PlayerState</a> : <code>Object</code></dt>
<dd><p>The state of a andesite-node player</p>
</dd>
<dt><a href="#EndReason">EndReason</a> : <code>String</code></dt>
<dd><p>The reason a track ended, either &quot;FINISHED&quot;, &quot;LOAD_FAILED&quot;, &quot;STOPPED&quot;, &quot;REPLACED&quot;, &quot;CLEANUP&quot;</p>
</dd>
<dt><a href="#PlayOptions">PlayOptions</a> : <code>Object</code></dt>
<dd><p>The options to play a song with</p>
</dd>
<dt><a href="#TrackInfo">TrackInfo</a> : <code>Object</code></dt>
<dd><p>Details about a specific track</p>
</dd>
<dt><a href="#Track">Track</a> : <code>Object</code></dt>
<dd><p>A track from the andesite-node  REST API</p>
</dd>
<dt><a href="#Playlist">Playlist</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="AndesiteClient"></a>

## AndesiteClient
**Kind**: global class  

* [AndesiteClient](#AndesiteClient)
    * [new AndesiteClient(config)](#new_AndesiteClient_new)
    * [.players](#AndesiteClient+players) : <code>Map.&lt;Number, Player&gt;</code>
    * [.songInfo](#AndesiteClient+songInfo) : <code>Map.&lt;String, Track&gt;</code>
    * [.join(serverId, channelId)](#AndesiteClient+join) ⇒ [<code>Player</code>](#Player)
    * [.voiceStateUpdate(data)](#AndesiteClient+voiceStateUpdate)
    * [.voiceServerUpdate(data)](#AndesiteClient+voiceServerUpdate)
    * ["forwardWs" (serverId, data)](#AndesiteClient+event_forwardWs)

<a name="new_AndesiteClient_new"></a>

### new AndesiteClient(config)
Main class of the module. The starting point of using Andesite.


| Param | Type |
| --- | --- |
| config | [<code>AndesiteConfig</code>](#AndesiteConfig) | 

<a name="AndesiteClient+players"></a>

### andesiteClient.players : <code>Map.&lt;Number, Player&gt;</code>
The players that andesiteclient instance has access to, mapped by serverID

**Kind**: instance property of [<code>AndesiteClient</code>](#AndesiteClient)  
<a name="AndesiteClient+songInfo"></a>

### andesiteClient.songInfo : <code>Map.&lt;String, Track&gt;</code>
A map of all songs fetched, mapped by trackID

**Kind**: instance property of [<code>AndesiteClient</code>](#AndesiteClient)  
<a name="AndesiteClient+join"></a>

### andesiteClient.join(serverId, channelId) ⇒ [<code>Player</code>](#Player)
Joins a voice channel

**Kind**: instance method of [<code>AndesiteClient</code>](#AndesiteClient)  
**Returns**: [<code>Player</code>](#Player) - The player for the channel  

| Param | Type | Description |
| --- | --- | --- |
| serverId | <code>String</code> | The id of the server where the voice channel is |
| channelId | <code>String</code> | The id of the channel to join |

<a name="AndesiteClient+voiceStateUpdate"></a>

### andesiteClient.voiceStateUpdate(data)
Updates the voice state

**Kind**: instance method of [<code>AndesiteClient</code>](#AndesiteClient)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The parsed "d" property of the JSON returned from the Discord VOICE_STATE_UPDATE event |

<a name="AndesiteClient+voiceServerUpdate"></a>

### andesiteClient.voiceServerUpdate(data)
Updates the voice server

**Kind**: instance method of [<code>AndesiteClient</code>](#AndesiteClient)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The parsed "d" property of the JSON returned from the Discord VOICE_SERVER_UPDATE event |

<a name="AndesiteClient+event_forwardWs"></a>

### "forwardWs" (serverId, data)
Emitted when there is something you need to send to the Discord gateway

**Kind**: event emitted by [<code>AndesiteClient</code>](#AndesiteClient)  

| Param | Type | Description |
| --- | --- | --- |
| serverId | <code>String</code> | The id of the server the event is for to make sure it's on the right shard |
| data | <code>String</code> | The data to send |

<a name="Node"></a>

## Node
**Kind**: global class  

* [Node](#Node)
    * [new Node()](#new_Node_new)
    * [.join(serverId, channelId, options)](#Node+join) ⇒ [<code>Player</code>](#Player)
    * [.destroy()](#Node+destroy)

<a name="new_Node_new"></a>

### new Node()
An interface to interact with andesite node.

<a name="Node+join"></a>

### node.join(serverId, channelId, options) ⇒ [<code>Player</code>](#Player)
Joins a channel

**Kind**: instance method of [<code>Node</code>](#Node)  
**Returns**: [<code>Player</code>](#Player) - The player for the voice channel  

| Param | Type | Description |
| --- | --- | --- |
| serverId | <code>String</code> | The server id where the voice channel to join is |
| channelId | <code>String</code> | The id of the voice channel to join |
| options | [<code>JoinOptions</code>](#JoinOptions) | The options to join with |

<a name="Node+destroy"></a>

### node.destroy()
Destroys the node

**Kind**: instance method of [<code>Node</code>](#Node)  
<a name="Player"></a>

## Player
**Kind**: global class  

* [Player](#Player)
    * [new Player()](#new_Player_new)
    * [.serverID](#Player+serverID) : <code>String</code>
    * [.nowPlaying](#Player+nowPlaying) : [<code>Track</code>](#Track)
    * [.state](#Player+state) : [<code>PlayerState</code>](#PlayerState)
    * [.paused](#Player+paused) : <code>Boolean</code>
    * [.volume](#Player+volume) : <code>Number</code>
    * [.position](#Player+position) : <code>Number</code>
    * [.play(track, [options])](#Player+play) ⇒ [<code>Track</code>](#Track)
    * [.stop()](#Player+stop) ⇒ <code>Boolean</code>
    * [.pause()](#Player+pause) ⇒ <code>Boolean</code>
    * [.resume()](#Player+resume) ⇒ <code>Boolean</code>
    * [.seek(position)](#Player+seek) ⇒ <code>Boolean</code>
    * [.setVolume(voulme)](#Player+setVolume) ⇒ <code>Number</code>
    * [.destroy()](#Player+destroy) ⇒ <code>Boolean</code>
    * ["update`"](#Player+event_update`)
    * ["trackEnd" (track, reason, playNext)](#Player+event_trackEnd)
    * ["trackError" (track, error)](#Player+event_trackError)
    * ["trackStuck" (track, thresholdMS)](#Player+event_trackStuck)
    * ["wsClosed" (code, reason, byRemote)](#Player+event_wsClosed)

<a name="new_Player_new"></a>

### new Player()
Interface to play music to a channel.

<a name="Player+serverID"></a>

### player.serverID : <code>String</code>
The Server's ID for which the player is created.

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+nowPlaying"></a>

### player.nowPlaying : [<code>Track</code>](#Track)
The currently playing track. (Would be null if nothing is playing)

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+state"></a>

### player.state : [<code>PlayerState</code>](#PlayerState)
The curent state of the player.

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+paused"></a>

### player.paused : <code>Boolean</code>
Wheather the music is currently paused or not.

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+volume"></a>

### player.volume : <code>Number</code>
The current volume of the player.

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+position"></a>

### player.position : <code>Number</code>
The position in the current playing song in ms ( -1 if no song is playing ).

**Kind**: instance property of [<code>Player</code>](#Player)  
<a name="Player+play"></a>

### player.play(track, [options]) ⇒ [<code>Track</code>](#Track)
Plays the song the current player.

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: [<code>Track</code>](#Track) - - The song played.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| track | <code>String</code> \| [<code>Queue</code>](#Queue) |  | The track ID from andesite to play or a [Queue](#Queue) class to play a queue. |
| [options] | [<code>PlayOptions</code>](#PlayOptions) | <code>{}</code> | The options to play song with. |

<a name="Player+stop"></a>

### player.stop() ⇒ <code>Boolean</code>
Stops the music.

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Boolean</code> - Returns true if the music was stopped, false if it wasn't playing.  
<a name="Player+pause"></a>

### player.pause() ⇒ <code>Boolean</code>
Pauses the music.

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Boolean</code> - Returns false if music is already paused and true if it was successfully paused.  
<a name="Player+resume"></a>

### player.resume() ⇒ <code>Boolean</code>
Resumes the music.

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Boolean</code> - Return false is music is already playing, and true is successfully resumed  
<a name="Player+seek"></a>

### player.seek(position) ⇒ <code>Boolean</code>
Seeks to a position in the currently playing track by a time in ms

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Boolean</code> - Returns false if no music is playing, returns true is position is updated.  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Number</code> | The position in the song to seek. |

<a name="Player+setVolume"></a>

### player.setVolume(voulme) ⇒ <code>Number</code>
Sets the volume of the music.

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Number</code> - The new volume  

| Param | Type | Description |
| --- | --- | --- |
| voulme | <code>Number</code> | The volume to set (Should be between 0 & 1000) |

<a name="Player+destroy"></a>

### player.destroy() ⇒ <code>Boolean</code>
Destroys the player

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Boolean</code> - Returns true if the player has been destroyed successfully  
<a name="Player+event_update`"></a>

### "update`"
Fires when andesite-node sends information about the current state.

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Type | Description |
| --- | --- |
| [<code>PlayerState</code>](#PlayerState) | The player's state. |

<a name="Player+event_trackEnd"></a>

### "trackEnd" (track, reason, playNext)
Fires when the current track (or song) ends.

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| track | [<code>Track</code>](#Track) | The track that ended. |
| reason | [<code>EndReason</code>](#EndReason) | The reason why the track changed. |
| playNext | <code>Boolean</code> | Whether more songs should have been played after this. |

<a name="Player+event_trackError"></a>

### "trackError" (track, error)
Fires when there is an error playing the track.

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| track | [<code>Track</code>](#Track) | The track which caused error. |
| error | <code>String</code> | The error from andesite-node. |

<a name="Player+event_trackStuck"></a>

### "trackStuck" (track, thresholdMS)
Fires when a track gets stuck.

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| track | [<code>Track</code>](#Track) | The track which is stuck. |
| thresholdMS | <code>Number</code> | The threshold for being stuck. |

<a name="Player+event_wsClosed"></a>

### "wsClosed" (code, reason, byRemote)
Fires when discord websockets are closed.

**Kind**: event emitted by [<code>Player</code>](#Player)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>Number</code> | The error code from discordapp. |
| reason | <code>String</code> | The reason why the connection was closed. |
| byRemote | <code>Boolean</code> | Whether teh connection was closed by remote source or not. |

<a name="Queue"></a>

## Queue
**Kind**: global class  

* [Queue](#Queue)
    * [new Queue()](#new_Queue_new)
    * [.player](#Queue+player) : [<code>Player</code>](#Player)
    * [.songs](#Queue+songs) : <code>Array.&lt;String&gt;</code>
    * [.add(song)](#Queue+add) ⇒ <code>String</code>
    * [.skipTo(index)](#Queue+skipTo) ⇒ <code>Boolean</code>
    * [.skip()](#Queue+skip) ⇒ <code>Boolean</code>
    * [.remove(index)](#Queue+remove) ⇒ <code>Boolean</code>

<a name="new_Queue_new"></a>

### new Queue()
The class used to create the queue

<a name="Queue+player"></a>

### queue.player : [<code>Player</code>](#Player)
The player on which the queue is playing on.

**Kind**: instance property of [<code>Queue</code>](#Queue)  
<a name="Queue+songs"></a>

### queue.songs : <code>Array.&lt;String&gt;</code>
The songs currently in the queue.

**Kind**: instance property of [<code>Queue</code>](#Queue)  
<a name="Queue+add"></a>

### queue.add(song) ⇒ <code>String</code>
Adds a song to the queue

**Kind**: instance method of [<code>Queue</code>](#Queue)  
**Returns**: <code>String</code> - The id of the added song  

| Param | Type | Description |
| --- | --- | --- |
| song | <code>String</code> | Andesite track id |

<a name="Queue+skipTo"></a>

### queue.skipTo(index) ⇒ <code>Boolean</code>
Skips to a song in the queue

**Kind**: instance method of [<code>Queue</code>](#Queue)  
**Returns**: <code>Boolean</code> - True to indicate success, or false to indicate failure  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index of the song to skip to |

<a name="Queue+skip"></a>

### queue.skip() ⇒ <code>Boolean</code>
Skips the currently playing song, a shortcut for Queue#skipTo(0)

**Kind**: instance method of [<code>Queue</code>](#Queue)  
**Returns**: <code>Boolean</code> - True to indicate success, or false to indicate failure  
<a name="Queue+remove"></a>

### queue.remove(index) ⇒ <code>Boolean</code>
Removes a song from the queue

**Kind**: instance method of [<code>Queue</code>](#Queue)  
**Returns**: <code>Boolean</code> - True to indicate success  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index of the song to remove |

<a name="Rest"></a>

## Rest
**Kind**: global class  

* [Rest](#Rest)
    * [new Rest(config, node)](#new_Rest_new)
    * [.search(query)](#Rest+search) ⇒ <code>Promise.&lt;(Array.&lt;Track&gt;\|Playlist)&gt;</code>

<a name="new_Rest_new"></a>

### new Rest(config, node)
The Class to use the Andesie Rest AI for loading tracks and some other stuff


| Param | Description |
| --- | --- |
| config | The configuration |
| node | The Node Class |

<a name="Rest+search"></a>

### rest.search(query) ⇒ <code>Promise.&lt;(Array.&lt;Track&gt;\|Playlist)&gt;</code>
**Kind**: instance method of [<code>Rest</code>](#Rest)  
**Returns**: <code>Promise.&lt;(Array.&lt;Track&gt;\|Playlist)&gt;</code> - The array of tracks returned or the playlist object  
**Since**: 1.0.0-alpha  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>String</code> | The search query to pass to andesite-node |

<a name="AndesiteConfig"></a>

## AndesiteConfig : <code>Object</code>
Configuration for Andesite

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| host | <code>String</code> | The host url for the andesite node |
| id | <code>String</code> | The id of the bot account you're using |

<a name="JoinOptions"></a>

## JoinOptions : <code>Object</code>
Options to join a voice channel with

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| self_deaf | <code>Boolean</code> | Whether or not to join the channel deafened |
| self_mute | <code>Boolean</code> | Whether or not to join the channel muted |

<a name="PlayerState"></a>

## PlayerState : <code>Object</code>
The state of a andesite-node player

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| position | <code>Number</code> | The position of the player in the current playing track |
| time | <code>Number</code> | The UNIX timestamp from the andesite-node server |
| localTime | <code>Number</code> | The local UNIX timestamp |

<a name="EndReason"></a>

## EndReason : <code>String</code>
The reason a track ended, either "FINISHED", "LOAD_FAILED", "STOPPED", "REPLACED", "CLEANUP"

**Kind**: global typedef  
<a name="PlayOptions"></a>

## PlayOptions : <code>Object</code>
The options to play a song with

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [startTime] | <code>Number</code> | <code>0</code> | The time to start the track from |
| [endTime] | <code>Number</code> | <code>Total Length</code> | The time to end the track at |

<a name="TrackInfo"></a>

## TrackInfo : <code>Object</code>
Details about a specific track

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| identifier | <code>String</code> | The id of the song |
| isSeekable | <code>Boolean</code> | Whether or not the track is seekable |
| author | <code>String</code> | The author of the song |
| length | <code>Number</code> | The length (in ms) of the song |
| isStream | <code>Boolean</code> | Whether or not the track is a stream |
| position | <code>Number</code> | The position of the track in the array |
| title | <code>String</code> | The title of the song |
| uri | <code>String</code> | The url to get to the song |

<a name="Track"></a>

## Track : <code>Object</code>
A track from the andesite-node  REST API

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| track | <code>String</code> | The track id |
| info | [<code>TrackInfo</code>](#TrackInfo) | Information about the track |

<a name="Playlist"></a>

## Playlist : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the playlist |
| selected | <code>String</code> | The position of the selected track |
| tracks | [<code>Array.&lt;Track&gt;</code>](#Track) | The tracks included in the playlist |

