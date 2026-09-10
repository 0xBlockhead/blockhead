import { describe, expect, it } from 'vitest'
import { redactAcpLocalValue } from '$/resolvers/AcpLocal-JsonRpc.ts'
import { createAcpLocalJsonRpcTransport, parseAcpLocalJsonRpcResponse } from './transport.ts'
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
	it('emits one exact request and returns its correlated result', async () => {
		const sent: unknown[] = []
		const transport = createAcpLocalJsonRpcTransport({
			id: () => '1',
			send: async (request) => {
				sent.push(request)
				return JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { ok: true } })
			},
		})
		await expect(transport.request('session/read', { sessionId: 'session-test' })).resolves.toEqual({ ok: true })
		await expect(transport.request('session/prompt', { sessionId: 'session-test' })).rejects.toThrow('unsupported read method')
		expect(sent).toEqual([{ jsonrpc: '2.0', id: '1', method: 'session/read', params: { sessionId: 'session-test' } }])
	})

	it.each(['initialize', 'session/list', 'session/read', 'session/history'])(
		'allows the read lifecycle method %s',
		async (method) => {
			const transport = createAcpLocalJsonRpcTransport({
				send: async (request) => JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { ok: true } }),
			})
			await expect(transport.request(method)).resolves.toEqual({ ok: true })
		}
	)

	it('rejects a mismatched response id', () => {
		expect(() => parseAcpLocalJsonRpcResponse('{"jsonrpc":"2.0","id":"other","result":true}', '1')).toThrow('response id mismatch')
	})

	it('converts a correlated protocol error', async () => {
		const transport = createAcpLocalJsonRpcTransport({
			send: async (request) => JSON.stringify({ jsonrpc: '2.0', id: request.id, error: { code: -1, message: 'unavailable' } }),
		})
		await expect(transport.request('initialize')).rejects.toThrow('unavailable')
	})

	it('rejects responses with neither or both result and error', () => {
		for (const payload of [
			'{"jsonrpc":"2.0","id":"1"}',
			'{"jsonrpc":"2.0","id":"1","result":true,"error":{"code":-1,"message":"failed"}}',
		])
			expect(() => parseAcpLocalJsonRpcResponse(payload, '1')).toThrow('exactly one of result or error')
	})

	it('rejects malformed JSON', () => {
		expect(() => parseAcpLocalJsonRpcResponse('not-json', '1')).toThrow('malformed')
	})

	it('does not send after disconnect', async () => {
		let sends = 0
		const transport = createAcpLocalJsonRpcTransport({ send: async () => { sends += 1; return '' } })
		transport.disconnect()
		await expect(transport.request('initialize')).rejects.toThrow('disconnected')
		expect(sends).toBe(0)
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
