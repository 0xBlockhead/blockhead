import { describe, expect, it } from 'vitest'
import { redactAcpLocalValue } from '$/resolvers/AcpLocal-JsonRpc.ts'
import { createAcpLocalJsonRpcTransport } from './transport.ts'
import { createAcpLocalRuntime, materializeAcpLocalSession } from './runtime.ts'
import type { AcpLocalRuntime } from './types.ts'

const fakeRuntime = (): AcpLocalRuntime => createAcpLocalRuntime({
	runtimeId: 'runtime-test',
	transportKind: 'fake-jsonrpc',
	initializedAt: 100,
	initialize: async () => ({ protocolVersion: '1', agentCapabilities: { prompt: true } }),
	readSession: async (sessionId) => ({ sessionId, runtimeId: 'runtime-test', createdAt: 101, status: 'open' }),
	listSessions: async () => [{ sessionId: 'session-test', runtimeId: 'runtime-test' }],
	readHistory: async (sessionId, boundary) => ({
		sessionId,
		sequenceStart: 4,
		sequenceEnd: boundary.beforeSequence == null ? 6 : boundary.beforeSequence - 1,
		updates: [{ sequence: 4, updateKind: 'message', payload: { token: 'private', visible: true } }],
		messages: [],
		turns: [],
		toolCalls: [],
		terminals: [],
		fileOperations: [],
		permissionRequests: [],
	}),
})

describe('ACP local JSON-RPC boundary', () => {
	it('keeps read access local and rejects mutation dispatch', async () => {
		const sent: string[] = []
		const transport = createAcpLocalJsonRpcTransport({
			id: () => '1',
			send: async (request) => {
				sent.push(request.method)
				return JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { ok: true } })
			},
		})
		for (const method of ['initialize', 'session/list', 'session/read', 'session/history'])
			await expect(transport.request(method, { sessionId: 'session-test' })).resolves.toEqual({ ok: true })
		await expect(transport.request('session/prompt', { sessionId: 'session-test' })).rejects.toThrow('unsupported read method')
		expect(sent).toEqual(['initialize', 'session/list', 'session/read', 'session/history'])
	})

	it('distinguishes malformed and disconnected runtime states', async () => {
		const transport = createAcpLocalJsonRpcTransport({ send: async () => 'not-json' })
		await expect(transport.request('initialize')).rejects.toThrow('malformed')
		transport.disconnect()
		await expect(transport.request('initialize')).rejects.toThrow('disconnected')
	})

	it('materializes stable identity and an explicit durable history boundary', async () => {
		const materialized = await materializeAcpLocalSession(fakeRuntime(), 'session-test', { limit: 1, beforeSequence: 7 })
		expect(materialized.identity).toEqual({ runtimeId: 'runtime-test', sessionId: 'session-test' })
		expect(materialized.historyBoundary).toEqual({ sequenceStart: 4, sequenceEnd: 6 })
		expect(materialized.durable.updates).toHaveLength(1)
	})

	it('redacts secret-bearing payload keys without dropping public fields', () => {
		expect(redactAcpLocalValue({ token: 'secret', visible: true, nested: { password: 'hidden' } })).toEqual({ token: '[REDACTED]', visible: true, nested: { password: '[REDACTED]' } })
	})
})
