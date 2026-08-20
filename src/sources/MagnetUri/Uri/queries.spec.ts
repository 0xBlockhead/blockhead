import {
	describe,
	expect,
	it,
} from 'vitest'

import { parseMagnetUri } from '$/sources/MagnetUri/Uri/queries.ts'

describe('Magnet URI parser', () => {
	it('preserves valid torrent identities and rejects malformed magnet input', () => {
		expect(parseMagnetUri(
			'magnet:?xt=urn%3Abtmh%3A12200123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
		).torrent).toEqual({
			infoHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
			hashVersion: 'v2',
		})

		expect(parseMagnetUri(
			'magnet:?xt=urn%3Abtih%3A0123456789abcdef0123456789abcdef01234567&xt=urn%3Abtmh%3A12200123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
		).torrent).toEqual({
			infoHash: '0123456789abcdef0123456789abcdef01234567',
			hashVersion: 'v1',
		})

		expect(() => parseMagnetUri('https://example.com/file')).toThrow(
			'expected a magnet URI'
		)
		expect(() => parseMagnetUri('magnet:?xl=-1')).toThrow(
			'invalid exact length'
		)
	})
})
