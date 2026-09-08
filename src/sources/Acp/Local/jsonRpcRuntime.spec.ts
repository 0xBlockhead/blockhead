import { describe, expect, it } from 'vitest'
import { createAcpLocalJsonRpcRuntime } from './jsonRpcRuntime.ts'
import type { AcpLocalJsonRpcTransport } from './transport.ts'

const session = { sessionId: 'session-1', runtimeId: 'runtime-1' }
const history = {
	sessionId: 'session-1',
	sequenceStart: 1,
	sequenceEnd: 1,
	updates: [],
	messages: [],
	turns: [],
	toolCalls: [],
	terminals: [],
	fileOperations: [],
	permissionRequests: [],
}

const transportFor = (responses: Record<string, unknown>, calls: { method: string; params?: unknown }[]): AcpLocalJsonRpcTransport => ({
	request: async (method, params) => {
		calls.push({ method, ...(params !== undefined && { params }) })
		return responses[method]
	},
	disconnect: () => undefined,
})

describe('ACP local JSON-RPC runtime adapter', () => {
	it('maps all read lifecycle methods and preserves identity/history arguments', async () => {
		const calls: { method: string; params?: unknown }[] = []
		const runtime = createAcpLocalJsonRpcRuntime({
			runtimeId: 'runtime-1',
			transportKind: 'fake-jsonrpc',
			transport: transportFor({
				initialize: { protocolVersion: '1' },
				'session/list': [session],
				'session/read': session,
				'session/history': history,
			}, calls),
		})

		await expect(runtime.initialize()).resolves.toEqual({ protocolVersion: '1' })
		await expect(runtime.listSessions()).resolves.toEqual([session])
		await expect(runtime.readSession('session-1')).resolves.toEqual(session)
		await expect(runtime.readHistory('session-1', { limit: 10, beforeSequence: 7 })).resolves.toEqual(history)
		expect(calls).toEqual([
			{ method: 'initialize' },
			{ method: 'session/list' },
			{ method: 'session/read', params: { sessionId: 'session-1' } },
			{ method: 'session/history', params: { sessionId: 'session-1', limit: 10, beforeSequence: 7 } },
		])
	})

	it('rejects malformed method results at the runtime boundary', async () => {
		const calls: { method: string; params?: unknown }[] = []
		const runtime = createAcpLocalJsonRpcRuntime({
			runtimeId: 'runtime-1',
			transportKind: 'fake-jsonrpc',
			transport: transportFor({ 'session/read': { sessionId: 'session-1' } }, calls),
		})
		await expect(runtime.readSession('session-1')).rejects.toThrow('malformed session result')
	})

	it('propagates transport protocol failures unchanged', async () => {
		const failure = new Error('AcpLocal_JsonRpc: response id mismatch')
		const runtime = createAcpLocalJsonRpcRuntime({
			runtimeId: 'runtime-1',
			transportKind: 'fake-jsonrpc',
			transport: {
				request: async () => { throw failure },
				disconnect: () => undefined,
			},
		})
		await expect(runtime.initialize()).rejects.toBe(failure)
	})
})
