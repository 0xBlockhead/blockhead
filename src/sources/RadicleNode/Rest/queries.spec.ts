import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { sourceGetJson } from '$/sources/_runtime/http.ts'
import {
	getNode,
	getStats,
	listRepos,
	parseConnectPeer,
	resolvedControlUrl,
} from '$/sources/RadicleNode/Rest/queries.ts'

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson: vi.fn(),
}))

const publicEnv = {
	RADICLE_NODE_CONTROL_URL: 'http://127.0.0.1:8080',
}
const nodeId = 'z6MksmpU5b1dS7oaqF2bHXhQi1DWy2hB7Mh9CuN7y1DN6QSz'
const node = {
	id: nodeId,
	agent: '/radicle:1.10.1/',
	state: 'running',
	config: {
		alias: 'seed.radicle.dev',
		connect: [
			`${nodeId}@seed.radicle.dev:58776`,
		],
		externalAddresses: [
			'seed.radicle.dev:58776',
		],
		peers: {
			type: 'dynamic',
		},
	},
}

describe('Radicle node control transport', () => {
	beforeEach(() => {
		vi.mocked(sourceGetJson).mockReset()
	})

	it('resolves an unauthenticated HTTP control URL', () => {
		expect(resolvedControlUrl(publicEnv)).toBe('http://127.0.0.1:8080')
	})

	it('uses GET for the exact v1 node, stats, and repos URLs', async () => {
		vi.mocked(sourceGetJson)
			.mockResolvedValueOnce(node)
			.mockResolvedValueOnce({ repos: { total: 14 } })
			.mockResolvedValueOnce([{ rid: 'rad:z6cFWeWpnZNHh9rUW8phgA3b5yGt' }])

		await expect(getNode(publicEnv)).resolves.toEqual(node)
		await expect(getStats(publicEnv)).resolves.toEqual({ repos: { total: 14 } })
		await expect(listRepos(publicEnv)).resolves.toEqual([{ rid: 'rad:z6cFWeWpnZNHh9rUW8phgA3b5yGt' }])

		expect(sourceGetJson).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				source: 'RadicleNode_Control',
			}),
			'http://127.0.0.1:8080/api/v1/node'
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			expect.anything(),
			'http://127.0.0.1:8080/api/v1/stats'
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			3,
			expect.anything(),
			'http://127.0.0.1:8080/api/v1/repos'
		)
	})

	it('parses official nid@address connect entries', () => {
		expect(parseConnectPeer(`${nodeId}@seed.radicle.dev:58776`)).toEqual({
			nodeId,
			address: 'seed.radicle.dev:58776',
		})
	})

	it('rejects malformed node and repos envelopes', async () => {
		vi.mocked(sourceGetJson).mockResolvedValueOnce({ id: 42 })
		await expect(getNode(publicEnv)).rejects.toThrow(
			'RadicleNode_Control: invalid node response envelope'
		)

		vi.mocked(sourceGetJson).mockResolvedValueOnce({ rid: 'missing-array' })
		await expect(listRepos(publicEnv)).rejects.toThrow(
			'RadicleNode_Control: invalid repos response envelope'
		)
	})

	it('rejects an empty control URL env', () => {
		expect(() => resolvedControlUrl({ RADICLE_NODE_CONTROL_URL: '' })).toThrow(
			'Missing or empty source endpoint env: RADICLE_NODE_CONTROL_URL'
		)
	})

	it('propagates transport failure without inventing empty state', async () => {
		const error = new Error('Radicle node unavailable')
		vi.mocked(sourceGetJson).mockRejectedValueOnce(error)
		await expect(getNode(publicEnv)).rejects.toBe(error)
	})

	it.each(['file:///tmp/node', 'https://user:secret@node.example'])('rejects unsafe control URL %s before transport', async (url) => {
		await expect(getNode({ RADICLE_NODE_CONTROL_URL: url })).rejects.toThrow('control URL must be an unauthenticated HTTP URL')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
