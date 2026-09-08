import {
	expect,
	it,
	vi,
} from 'vitest'

const {
	directGetPeerId,
	directListData,
} = vi.hoisted(() => ({
	directGetPeerId: vi.fn(),
	directListData: vi.fn(),
}))

vi.mock('$app/server', () => ({
	query: <_Arguments extends unknown[], _Result>(
		handler: (...arguments_: _Arguments) => _Result
	) => Object.assign(handler, { __: { type: 'query' } }),
}))

vi.mock('$/sources/CodexNode/Rest/queries.ts', () => ({
	getPeerId: directGetPeerId,
	listData: directListData,
}))

const {
	getEndpoint,
	getPeerId,
	listData,
} = await import('$/sources/CodexNode/Rest/queries.remote.ts')

it('denies every remote bridge operation before host-local Codex access or endpoint disclosure', async () => {
	for (const remoteQuery of [getEndpoint, getPeerId, listData])
		await expect(remoteQuery()).rejects.toThrow(
			'CodexNode_Rest: LocalOnly authority is unavailable through remote queries'
		)

	expect(directGetPeerId).not.toHaveBeenCalled()
	expect(directListData).not.toHaveBeenCalled()
})
