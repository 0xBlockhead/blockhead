import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Transmission/bindings.ts'
import { Source } from '$/sources/Source.ts'


const { sourceFetch } = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'http://127.0.0.1:9091/transmission/rpc',
	sourceFetch,
}))

const {
	sessionGet,
	sessionStats,
	torrentGet,
} = await import('$/sources/Transmission/Rpc/queries.ts')

const binding = bindings[Source.TransmissionRpc_JsonRpc][0]
const response = (
	body: unknown,
	status = 200,
	headers: Record<string, string> = {}
) => new Response(JSON.stringify(body), {
	status,
	headers,
})

describe('Transmission RPC reads', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('performs the session-id handshake before returning a typed torrent hierarchy', async () => {
		sourceFetch
			.mockResolvedValueOnce(response({}, 409, {
				'x-transmission-session-id': 'session-token',
			}))
			.mockResolvedValueOnce(response({
				result: 'success',
				arguments: {
					torrents: [{
						hashString: '0123456789abcdef0123456789abcdef01234567',
						name: 'release',
						files: [{
							name: 'release/image.iso',
							length: 1_024,
						}],
					}],
				},
			}))

		await expect(torrentGet(binding, [
			'hashString',
			'name',
			'files',
		])).resolves.toEqual({
			torrents: [{
				hashString: '0123456789abcdef0123456789abcdef01234567',
				name: 'release',
				files: [{
					name: 'release/image.iso',
					length: 1_024,
				}],
			}],
		})
		expect(sourceFetch).toHaveBeenNthCalledWith(
			2,
			binding,
			'http://127.0.0.1:9091/transmission/rpc',
			expect.objectContaining({
				headers: expect.objectContaining({
					'x-transmission-session-id': 'session-token',
				}),
			})
		)
	})

	it('loads session identity and aggregate transfer observations', async () => {
		sourceFetch
			.mockResolvedValueOnce(response({
				result: 'success',
				arguments: {
					version: '4.0.6',
					'peer-port': 51_413,
				},
			}))
			.mockResolvedValueOnce(response({
				result: 'success',
				arguments: {
					activeTorrentCount: 2,
					downloadSpeed: 512,
					'cumulative-stats': {
						downloadedBytes: 4_096,
					},
				},
			}))

		await expect(sessionGet(binding)).resolves.toMatchObject({
			version: '4.0.6',
			'peer-port': 51_413,
		})
		await expect(sessionStats(binding)).resolves.toMatchObject({
			activeTorrentCount: 2,
			downloadSpeed: 512,
		})
	})

	it('fails closed on provider errors and malformed envelopes', async () => {
		sourceFetch
			.mockResolvedValueOnce(response({
				result: 'permission denied',
				arguments: {},
			}))
			.mockResolvedValueOnce(response({
				result: 'success',
				arguments: {
					torrents: [{ hashString: 12 }],
				},
			}))

		await expect(sessionGet(binding)).rejects.toThrow('session-get failed: permission denied')
		await expect(torrentGet(binding, ['hashString'])).rejects.toThrow('invalid torrent-get response envelope')
	})
})
