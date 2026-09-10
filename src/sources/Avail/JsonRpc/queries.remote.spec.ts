import { expect, it, vi } from 'vitest'

vi.mock('$env/dynamic/public', () => ({
	env: { PUBLIC_AVAIL_RPC_URL: 'https://configured.example/rpc' },
}))

vi.mock('$app/server', () => ({
	query: <_Input, _Output>(
		schema: { assert: (input: unknown) => _Input } | (() => _Output),
		handler?: (input: _Input) => _Output
	) => {
		if (!('assert' in schema))
			return schema

		return (input: unknown) => {
			if (handler == null)
				throw new Error('Missing query handler')

			return handler(schema.assert(input))
		}
	},
}))

const { getBlockHash, getDataProof } = await import('$/sources/Avail/JsonRpc/queries.remote.ts')

it('uses server configuration for native RPC and rejects endpoint overrides before fetch', async () => {
	const hash = `0x${'a'.repeat(64)}`
	const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		result: hash,
	})))
	vi.stubGlobal('fetch', fetchMock)
	try {
		await expect(getBlockHash(42n)).resolves.toBe(hash)
		expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
			'https://configured.example/rpc',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'chain_getBlockHash',
					params: [42],
				}),
			})
		)
		const overridden = {
			blockHash: hash,
			extrinsicIndex: 0,
			endpoint: 'https://caller.example',
		}
		expect(() => getDataProof(overridden)).toThrow()
		expect(fetchMock).toHaveBeenCalledTimes(1)
	} finally {
		vi.unstubAllGlobals()
	}
})
