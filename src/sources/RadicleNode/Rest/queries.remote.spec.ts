import { beforeEach, expect, it, vi } from 'vitest'

const control = vi.hoisted(() => ({
	getNode: vi.fn(),
	getStats: vi.fn(),
	listRepos: vi.fn(),
	request: { isRemoteRequest: false },
}))

vi.mock('$app/server', () => ({
	query: <_Result>(handler: () => _Result) => Object.assign(handler, {
		__: { type: 'query' },
	}),
	getRequestEvent: () => control.request,
}))
vi.mock('$env/dynamic/private', () => ({
	env: { RADICLE_NODE_CONTROL_URL: 'http://private-node:8080' },
}))
vi.mock('$/sources/RadicleNode/Rest/queries.ts', () => control)

const queries = await import('$/sources/RadicleNode/Rest/queries.remote.ts')

beforeEach(() => {
	control.getNode.mockReset()
	control.getStats.mockReset()
	control.listRepos.mockReset()
	control.request.isRemoteRequest = false
})

it('denies every remote operation before accessing host-local state', async () => {
	control.request.isRemoteRequest = true
	for (const operation of [queries.getNode, queries.getStats, queries.listRepos])
		await expect(async () => operation()).rejects.toThrow('ServerOnly authority')

	expect(control.getNode).not.toHaveBeenCalled()
	expect(control.getStats).not.toHaveBeenCalled()
	expect(control.listRepos).not.toHaveBeenCalled()
})

it('uses private configuration and timestamps only the completed node response', async () => {
	const clock = vi.spyOn(Date, 'now').mockReturnValue(1234)
	control.getNode.mockImplementation(async () => {
		expect(clock).not.toHaveBeenCalled()
		return { id: 'node', config: { alias: 'My node' } }
	})
	try {
		await expect(queries.getNode()).resolves.toEqual({
			id: 'node',
			config: { alias: 'My node' },
			observedAtMs: 1234,
		})
		expect(control.getNode).toHaveBeenCalledExactlyOnceWith({
			RADICLE_NODE_CONTROL_URL: 'http://private-node:8080',
		})
	} finally {
		clock.mockRestore()
	}
})

it('does not create an observation on transport failure', async () => {
	const error = new Error('offline')
	const clock = vi.spyOn(Date, 'now')
	control.getNode.mockRejectedValueOnce(error)
	try {
		await expect(queries.getNode()).rejects.toBe(error)
		expect(clock).not.toHaveBeenCalled()
	} finally {
		clock.mockRestore()
	}
})
