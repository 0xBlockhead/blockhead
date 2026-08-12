import {
	describe,
	expect,
	it,
} from 'vitest'

import { parseMagnetUri } from '$/sources/MagnetUri/Uri/queries.ts'

describe('Magnet URI parser', () => {
	it('parses BitTorrent v2 multihash identity without retaining the multicodec prefix', () => {
		expect(parseMagnetUri(
			'magnet:?xt=urn%3Abtmh%3A12200123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
		).torrent).toEqual({
			infoHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
			hashVersion: 'v2',
		})
	})

	it('preserves URI ordering when a hybrid magnet carries both identities', () => {
		expect(parseMagnetUri(
			'magnet:?xt=urn%3Abtih%3A0123456789abcdef0123456789abcdef01234567&xt=urn%3Abtmh%3A12200123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
		).torrent).toEqual({
			infoHash: '0123456789abcdef0123456789abcdef01234567',
			hashVersion: 'v1',
		})
	})

	it('fails closed for a non-magnet URI or malformed exact length', () => {
		expect(() => parseMagnetUri('https://example.com/file')).toThrow(
			'expected a magnet URI'
		)
		expect(() => parseMagnetUri('magnet:?xl=-1')).toThrow(
			'invalid exact length'
		)
	})
})
