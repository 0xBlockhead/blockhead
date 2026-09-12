import { describe, expect, it } from 'vitest'

import { createAcpLocalResolverModule } from '$/resolvers/AcpLocal-JsonRpc.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { createAcpLocalRuntime } from '$/sources/Acp/Local/runtime.ts'
import type { AcpLocalRuntime } from '$/sources/Acp/Local/types.ts'

const runtimeId = 'runtime-test'
const sessionId = 'session-test'
const context = { pagination: {} }

const runtime = (): AcpLocalRuntime => createAcpLocalRuntime({
	runtimeId,
	transportKind: 'fake-jsonrpc',
	initializedAt: 123,
	initialize: async () => ({ protocolVersion: '1.0' }),
	readSession: async (id) => ({ sessionId: id, runtimeId, status: 'open' }),
	listSessions: async () => [{ sessionId, runtimeId }],
	readHistory: async (id) => ({
		sessionId: id,
		sequenceStart: 4,
		sequenceEnd: 4,
		updates: [{ sequence: 4, updateKind: 'message', payload: { token: 'secret', visible: true } }],
		messages: [],
		turns: [{ turnId: 'turn-test', toolCallIds: [] }],
		toolCalls: [],
		terminals: [],
		fileOperations: [],
		permissionRequests: [],
	}),
	mutate: async (request) => ({ accepted: true, sessionId: request.sessionId }),
})

const resolverFor = (acpRuntime: AcpLocalRuntime, entityType: EntityType) => {
	const resolver = createAcpLocalResolverModule(acpRuntime).resolvers.find((candidate) => candidate.entityType === entityType)
	if (resolver == null)
		throw new Error(`Missing ACP resolver for ${entityType}`)
	return resolver
}

describe('ACP local runtime resolver boundary', () => {
	it('materializes runtime session and initialization children from the injected local runtime', async () => {
		const acpRuntime = runtime()
		const runtimeResolver = resolverFor(acpRuntime, EntityType.AcpAgentRuntime)
		const timestampResolver = resolverFor(acpRuntime, EntityType.AcpAgentRuntime_Timestamp)
		const sessionResolver = resolverFor(acpRuntime, EntityType.AcpSession)
		const snapshot = await runtimeResolver.resolve.RuntimeId.resolve({ runtimeId }, context)

		expect(await runtimeResolver.projections.$$sessions(snapshot)).toEqual([
			{ [EntityMetaKey.Selector]: { $runtime: { runtimeId }, sessionId } },
		])
		expect(runtimeResolver.projections.$$timestamps(snapshot)).toEqual([
			{ [EntityMetaKey.Selector]: { $runtime: { runtimeId }, timestampMs: 123, source: Source.AcpLocal_JsonRpc } },
		])
		await expect(timestampResolver.resolve.RuntimeTimestampMsSource.resolve({ $runtime: { runtimeId }, timestampMs: 123, source: Source.AcpLocal_JsonRpc }, context)).resolves.toMatchObject({ timestampMs: 123, protocolVersion: '1.0' })
		await expect(sessionResolver.resolve.SessionId.resolve({ sessionId }, context)).resolves.toMatchObject({ sessionId, runtimeId })
	})

	it('preserves source applicability and redacts secret-bearing session updates', async () => {
		const acpRuntime = runtime()
		const updateResolver = resolverFor(acpRuntime, EntityType.AcpSessionUpdate)

		expect(createAcpLocalResolverModule(acpRuntime).source).toBe(Source.AcpLocal_JsonRpc)
		await expect(updateResolver.resolve.SessionSequence.resolve({ $session: { sessionId }, sequence: 4 }, context)).resolves.toEqual([
			expect.objectContaining({
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.AcpSessionUpdate, [], 'payload')]: { token: '[REDACTED]', visible: true },
				}),
			}),
		])
	})

	it.each([
		['a runtime selector for another runtime', () => resolverFor(runtime(), EntityType.AcpAgentRuntime).resolve.RuntimeId.resolve({ runtimeId: 'other' }, context), 'runtime other unavailable'],
		['a session from another runtime', () => resolverFor({ ...runtime(), readSession: async () => ({ sessionId, runtimeId: 'other' }) }, EntityType.AcpSession).resolve.SessionId.resolve({ sessionId }, context), 'session session-test belongs to another runtime'],
		['a malformed durable history boundary', async () => {
			const acpRuntime = createAcpLocalRuntime({
				...runtime(),
				readHistory: async () => ({ sessionId, sequenceStart: 2, sequenceEnd: 1, updates: [], messages: [], turns: [], toolCalls: [], terminals: [], fileOperations: [], permissionRequests: [] }),
			})
			const sessionResolver = resolverFor(acpRuntime, EntityType.AcpSession)
			const session = await sessionResolver.resolve.SessionId.resolve({ sessionId }, context)
			return sessionResolver.projections.$$promptTurns(session, { sessionId }, context)
		}, 'invalid durable history boundary'],
	])('rejects %s', async (_label, resolve, message) => {
		await expect(resolve()).rejects.toThrow(message)
	})

	it('fails closed without a configured local runtime', async () => {
		await expect(createAcpLocalResolverModule().resolvers[0].resolve.RuntimeId.resolve({ runtimeId }, context)).rejects.toThrow('local runtime unavailable')
	})
})
