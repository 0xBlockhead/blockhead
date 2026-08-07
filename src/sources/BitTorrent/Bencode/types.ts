/**
 * BitTorrent bencode-shaped wire values after decode (fail-closed arktype).
 * @see https://www.bittorrent.org/beps/bep_0003.html
 * @see https://www.bittorrent.org/beps/bep_0015.html
 */

import { type as arktype } from 'arktype'


const nonNegativeInteger = arktype('number.integer >= 0')

export const torrentTrackerAnnounceRequestWire = arktype({
	infoHash: 'string > 0',
	peerId: 'string > 0',
	port: 'number.integer >= 0 <= 65535',
	uploaded: nonNegativeInteger,
	downloaded: nonNegativeInteger,
	left: nonNegativeInteger,
	'event?': "'started' | 'stopped' | 'completed' | 'paused'",
})

export type TorrentTrackerAnnounceRequest = typeof torrentTrackerAnnounceRequestWire.infer

/** Decoded HTTP/UDP tracker announce dict (peers may be compact binary or list). */
export const torrentTrackerAnnounceResponseWire = arktype({
	'failure reason?': 'string > 0',
	'warning message?': 'string > 0',
	'interval?': nonNegativeInteger,
	'min interval?': nonNegativeInteger,
	'tracker id?': 'string > 0',
	'complete?': nonNegativeInteger,
	'incomplete?': nonNegativeInteger,
	'downloaded?': nonNegativeInteger,
	'peers?': 'unknown',
	'peers6?': 'unknown',
})

export type TorrentTrackerAnnounceResponse = typeof torrentTrackerAnnounceResponseWire.infer

export const torrentMetainfoInfoWire = arktype({
	name: 'string > 0',
	'piece length': 'number.integer > 0',
	pieces: 'unknown',
	'length?': 'number.integer >= 0',
	'files?': arktype({
		length: 'number.integer >= 0',
		path: 'string[]',
	}).array(),
	'private?': '0 | 1',
})

export type TorrentMetainfoInfo = typeof torrentMetainfoInfoWire.infer

export const torrentMetainfoWire = arktype({
	info: torrentMetainfoInfoWire,
	'announce?': 'string > 0',
	'announce-list?': arktype('string[]').array(),
	'creation date?': nonNegativeInteger,
	'comment?': 'string',
	'created by?': 'string',
	'encoding?': 'string',
})

export type TorrentMetainfo = typeof torrentMetainfoWire.infer
