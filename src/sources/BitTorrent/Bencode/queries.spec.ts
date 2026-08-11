import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	httpTrackerAnnounceSearchParams,
	parseTorrentMetainfo,
	parseTrackerAnnounceResponse,
} from '$/sources/BitTorrent/Bencode/queries.ts'

describe('BitTorrent Bencode queries', () => {
	it('builds announce search params from a fail-closed request', () => {
		expect(httpTrackerAnnounceSearchParams({
			infoHash: 'abcdefghij0123456789',
			peerId: '-BH0001-012345678901',
			port: 6881,
			uploaded: 0,
			downloaded: 0,
			left: 1,
			event: 'started',
		}).toString()).toBe(
			'info_hash=abcdefghij0123456789&peer_id=-BH0001-012345678901&port=6881&uploaded=0&downloaded=0&left=1&event=started'
		)
	})

	it('rejects invalid announce ports', () => {
		expect(() => httpTrackerAnnounceSearchParams({
			infoHash: 'abcdefghij0123456789',
			peerId: '-BH0001-012345678901',
			port: 70_000,
			uploaded: 0,
			downloaded: 0,
			left: 0,
		})).toThrow('invalid announce request bencode envelope')
	})

	it('parses a decoded announce response with seeder/leecher leftovers', () => {
		expect(parseTrackerAnnounceResponse({
			interval: 1800,
			complete: 12,
			incomplete: 3,
			downloaded: 40,
			peers: '',
		})).toEqual({
			interval: 1800,
			complete: 12,
			incomplete: 3,
			downloaded: 40,
			peers: '',
		})
	})

	it('parses a decoded single-file metainfo dict', () => {
		expect(parseTorrentMetainfo({
			announce: 'https://tracker.example/announce',
			info: {
				name: 'example.bin',
				'piece length': 262144,
				pieces: new Uint8Array(20),
				length: 1024,
			},
		}).info.name).toBe('example.bin')
	})

	it('rejects metainfo missing piece length', () => {
		expect(() => parseTorrentMetainfo({
			info: {
				name: 'example.bin',
				pieces: new Uint8Array(20),
				length: 1024,
			},
		})).toThrow('invalid metainfo bencode envelope')
	})

	it('rejects metainfo whose v1 hashes cannot cover its declared content', () => {
		expect(() => parseTorrentMetainfo({
			info: {
				name: 'example.bin',
				'piece length': 1024,
				pieces: new Uint8Array(20),
				length: 2048,
			},
		})).toThrow('piece hash count does not match content length')

		expect(() => parseTorrentMetainfo({
			info: {
				name: 'example.bin',
				'piece length': 1024,
				pieces: new Uint8Array(21),
				length: 1024,
			},
		})).toThrow('pieces must be concatenated 20-byte hashes')
	})

	it('rejects ambiguous or unsafe multi-file layouts', () => {
		expect(() => parseTorrentMetainfo({
			info: {
				name: 'example',
				'piece length': 1024,
				pieces: new Uint8Array(20),
				length: 1024,
				files: [{
					length: 1024,
					path: ['example.bin'],
				}],
			},
		})).toThrow('must have either length or files')

		expect(() => parseTorrentMetainfo({
			info: {
				name: 'example',
				'piece length': 1024,
				pieces: new Uint8Array(20),
				files: [{
					length: 1024,
					path: ['..'],
				}],
			},
		})).toThrow('invalid file entry')
	})
})
