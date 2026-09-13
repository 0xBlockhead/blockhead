import { afterEach, expect, it, vi } from 'vitest'

const { env, connect } = vi.hoisted(() => ({
	env: { THEGRAPH_API_KEY: '' },
	connect: vi.fn(async (options: { url: URL, transportKind: string, headers?: HeadersInit }) => options),
}))
vi.mock('$env/dynamic/private', () => ({ env }))
vi.mock('$/sources/Mcp/Protocol/client.server.ts', () => ({ connectRemoteMcpClient: connect }))

import { connectSubgraphMcp } from './client.server.ts'

afterEach(() => {
	env.THEGRAPH_API_KEY = ''
	vi.clearAllMocks()
})

it('rejects missing credentials before contacting the provider', async () => {
	await expect(connectSubgraphMcp()).rejects.toThrow('configured gateway API key')
	expect(connect).not.toHaveBeenCalled()
})

it('uses the declared provider endpoint and a server-side authorization header', async () => {
	env.THEGRAPH_API_KEY = ' test-only-key '
	await connectSubgraphMcp()
	expect(connect).toHaveBeenCalledExactlyOnceWith({
		url: new URL('https://subgraphs.mcp.thegraph.com/sse'),
		transportKind: 'sse',
		headers: { Authorization: 'Bearer test-only-key' },
	})
})
