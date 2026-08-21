import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { getAcpLocalRuntime } from '$/sources/Acp/Local/runtime.ts'
import type { AcpLocalHistorySnapshot, AcpLocalMessage, AcpLocalMessagePart, AcpLocalPermissionRequest, AcpLocalSessionUpdate, AcpLocalTerminal, AcpLocalToolCall, AcpLocalTurn } from '$/sources/Acp/Local/types.ts'

const redactedKey = /authorization|credential|password|raw|secret|token/i

export const redactAcpLocalValue = (value: unknown): unknown => {
	if (Array.isArray(value))
		return value.map(redactAcpLocalValue)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, redactedKey.test(key) ? '[REDACTED]' : redactAcpLocalValue(child)]))
	return value
}

const runtimeSelector = (runtimeId: string) => ({ [EntityMetaKey.Selector]: { runtimeId } })
const history = async (sessionId: string, context: ResolverContext): Promise<AcpLocalHistorySnapshot> => getAcpLocalRuntime().readHistory(sessionId, {
	limit: Math.min(context.pagination.limit ?? 100, 1000),
})

const sessionIdFrom = (selector: { readonly $session: { readonly sessionId: string } }) => selector.$session.sessionId

const childRows = (rows: readonly AcpLocalSessionUpdate[], sessionId: string) => rows.map((row) => ({
	[EntityMetaKey.Selector]: { $session: { sessionId }, sequence: row.sequence },
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.AcpSessionUpdate, [], 'updateKind')]: row.updateKind,
		...(row.timestampMs != null && { [entityFieldAddressKey(EntityType.AcpSessionUpdate, [], 'timestampMs')]: row.timestampMs }),
		...(row.payload != null && { [entityFieldAddressKey(EntityType.AcpSessionUpdate, [], 'payload')]: redactAcpLocalValue(row.payload) }),
	},
}))

const messageRows = (rows: readonly AcpLocalMessage[], sessionId: string) => rows.map((row) => ({
	[EntityMetaKey.Selector]: { $session: { sessionId }, messageId: row.messageId },
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.AcpMessage, [], 'role')]: row.role,
		...(row.createdAt != null && { [entityFieldAddressKey(EntityType.AcpMessage, [], 'createdAt')]: row.createdAt }),
	},
}))

const turnRows = (rows: readonly AcpLocalTurn[], sessionId: string) => rows.map((row) => ({
	[EntityMetaKey.Selector]: { $session: { sessionId }, turnId: row.turnId },
	[EntityMetaKey.Fields]: {
		...(row.startedAt != null && { [entityFieldAddressKey(EntityType.AcpPromptTurn, [], 'startedAt')]: row.startedAt }),
		...(row.completedAt != null && { [entityFieldAddressKey(EntityType.AcpPromptTurn, [], 'completedAt')]: row.completedAt }),
		...(row.cancelledAt != null && { [entityFieldAddressKey(EntityType.AcpPromptTurn, [], 'cancelledAt')]: row.cancelledAt }),
		...(row.stopReason != null && { [entityFieldAddressKey(EntityType.AcpPromptTurn, [], 'stopReason')]: row.stopReason }),
		...(row.userPromptHashAlgorithm != null && { [entityFieldAddressKey(EntityType.AcpPromptTurn, [], 'userPromptHashAlgorithm')]: row.userPromptHashAlgorithm }),
		...(row.userPromptHash != null && { [entityFieldAddressKey(EntityType.AcpPromptTurn, [], 'userPromptHash')]: row.userPromptHash }),
	},
}))

const toolCallRows = (rows: readonly AcpLocalToolCall[], sessionId: string) => rows.map((row) => ({
	[EntityMetaKey.Selector]: { $promptTurn: { $session: { sessionId }, turnId: row.turnId }, toolCallId: row.toolCallId },
	[EntityMetaKey.Fields]: {
		...(row.toolName != null && { [entityFieldAddressKey(EntityType.AcpToolCall, [], 'toolName')]: row.toolName }),
		...(row.serverName != null && { [entityFieldAddressKey(EntityType.AcpToolCall, [], 'serverName')]: row.serverName }),
		...(row.startedAt != null && { [entityFieldAddressKey(EntityType.AcpToolCall, [], 'startedAt')]: row.startedAt }),
		...(row.completedAt != null && { [entityFieldAddressKey(EntityType.AcpToolCall, [], 'completedAt')]: row.completedAt }),
		...(row.inputHashAlgorithm != null && { [entityFieldAddressKey(EntityType.AcpToolCall, [], 'inputHashAlgorithm')]: row.inputHashAlgorithm }),
		...(row.inputHash != null && { [entityFieldAddressKey(EntityType.AcpToolCall, [], 'inputHash')]: row.inputHash }),
		...(row.outputHashAlgorithm != null && { [entityFieldAddressKey(EntityType.AcpToolCall, [], 'outputHashAlgorithm')]: row.outputHashAlgorithm }),
		...(row.outputHash != null && { [entityFieldAddressKey(EntityType.AcpToolCall, [], 'outputHash')]: row.outputHash }),
	},
}))

const terminalRows = (rows: readonly AcpLocalTerminal[], sessionId: string) => rows.map((row) => ({
	[EntityMetaKey.Selector]: { $session: { sessionId }, terminalId: row.terminalId },
	[EntityMetaKey.Fields]: {
		...(row.command != null && { [entityFieldAddressKey(EntityType.AcpTerminal, [], 'command')]: row.command }),
		...(row.cwd != null && { [entityFieldAddressKey(EntityType.AcpTerminal, [], 'cwd')]: row.cwd }),
		...(row.createdAt != null && { [entityFieldAddressKey(EntityType.AcpTerminal, [], 'createdAt')]: row.createdAt }),
		...(row.releasedAt != null && { [entityFieldAddressKey(EntityType.AcpTerminal, [], 'releasedAt')]: row.releasedAt }),
	},
}))

const permissionRows = (rows: readonly AcpLocalPermissionRequest[], sessionId: string) => rows.map((row) => ({
	[EntityMetaKey.Selector]: { $session: { sessionId }, requestId: row.requestId },
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.AcpPermissionRequest, [], 'requestKind')]: row.requestKind,
		...(row.createdAt != null && { [entityFieldAddressKey(EntityType.AcpPermissionRequest, [], 'createdAt')]: row.createdAt }),
		...(row.resolvedAt != null && { [entityFieldAddressKey(EntityType.AcpPermissionRequest, [], 'resolvedAt')]: row.resolvedAt }),
		...(row.decision != null && { [entityFieldAddressKey(EntityType.AcpPermissionRequest, [], 'decision')]: row.decision }),
		...(row.payload != null && { [entityFieldAddressKey(EntityType.AcpPermissionRequest, [], 'payload')]: redactAcpLocalValue(row.payload) }),
	},
}))

export default {
	source: Source.AcpLocal_JsonRpc,
	resolvers: [
		defineResolver({ entityType: EntityType.AcpAgentRuntime, resolve: { RuntimeId: { resolve: async ({ runtimeId }) => {
			const runtime = getAcpLocalRuntime()
			if (runtime.runtimeId !== runtimeId) throw new Error(`AcpLocal_JsonRpc: runtime ${runtimeId} unavailable`)
			return {
				runtimeId: runtime.runtimeId,
				transportKind: runtime.transportKind,
				...(runtime.processId != null && { processId: runtime.processId }),
				...(runtime.initializedAt != null && { initializedAt: runtime.initializedAt }),
			}
		} } } })({
		$$sessions: () => [],
		$$timestamps: () => [],
	}),
		defineResolver({ entityType: EntityType.AcpAgentRuntime_Timestamp, resolve: { RuntimeTimestampMsSource: { resolve: async ({ $runtime }) => { const runtime = getAcpLocalRuntime(); const initialized = await runtime.initialize(); return { $runtime, timestampMs: Date.now(), source: Source.AcpLocal_JsonRpc, health: 'ready', ...initialized } } } } })({}),
		defineResolver({ entityType: EntityType.AcpSession, resolve: { SessionId: { resolve: async ({ sessionId }) => getAcpLocalRuntime().readSession(sessionId) } } })({
			$runtime: (session) => runtimeSelector(session.runtimeId),
			$$promptTurns: async (session, selector, context) => turnRows((await history(session.sessionId, context)).turns, session.sessionId),
		}),
		defineResolver({ entityType: EntityType.AcpSessionUpdate, resolve: { SessionSequence: { resolve: async (selector, context) => childRows((await history(sessionIdFrom(selector), context)).updates.filter((row) => row.sequence === selector.sequence), sessionIdFrom(selector)) } } })({}),
		defineResolver({ entityType: EntityType.AcpMessage, resolve: { SessionMessageId: { resolve: async (selector, context) => messageRows((await history(sessionIdFrom(selector), context)).messages.filter((row) => row.messageId === selector.messageId), sessionIdFrom(selector)) } } })({
			$$parts: async (message, selector, context) => (await history(sessionIdFrom(selector as { readonly $session: { readonly sessionId: string } }), context)).messages.find((row) => row.messageId === message.messageId)?.parts.map((part) => ({ [EntityMetaKey.Selector]: { $message: selector, partIndex: part.partIndex } })) ?? [],
		}),
		defineResolver({ entityType: EntityType.AcpMessagePart, resolve: { MessagePartIndex: { resolve: async (selector, context) => {
			const rows = (await history(sessionIdFrom(selector.$message as { readonly $session: { readonly sessionId: string } }), context)).messages.flatMap((message) => message.parts.map((part) => ({ message, part }))).filter(({ message, part }) => message.messageId === selector.$message.messageId && part.partIndex === selector.partIndex)
			return rows.map(({ message, part }) => ({ [EntityMetaKey.Selector]: { $message: { $session: { sessionId: sessionIdFrom(selector.$message as { readonly $session: { readonly sessionId: string } }) }, messageId: message.messageId }, partIndex: part.partIndex }, [EntityMetaKey.Fields]: { [entityFieldAddressKey(EntityType.AcpMessagePart, [], 'partKind')]: part.partKind, ...(part.text != null && { [entityFieldAddressKey(EntityType.AcpMessagePart, [], 'text')]: part.text }), ...(part.uri != null && { [entityFieldAddressKey(EntityType.AcpMessagePart, [], 'uri')]: part.uri }), ...(part.mimeType != null && { [entityFieldAddressKey(EntityType.AcpMessagePart, [], 'mimeType')]: part.mimeType }), ...(part.payload != null && { [entityFieldAddressKey(EntityType.AcpMessagePart, [], 'payload')]: redactAcpLocalValue(part.payload) }) } }))
		} } } })({}),
		defineResolver({ entityType: EntityType.AcpPromptTurn, resolve: { SessionTurnId: { resolve: async (selector, context) => turnRows((await history(sessionIdFrom(selector), context)).turns.filter((row) => row.turnId === selector.turnId), sessionIdFrom(selector)) } } })({
			$$timestamps: (turn) => turn.toolCallIds.map((toolCallId) => ({ [EntityMetaKey.Selector]: { $toolCall: { $promptTurn: { $session: turn.$session, turnId: turn.turnId }, toolCallId }, timestampMs: 0, source: Source.AcpLocal_JsonRpc } })),
		}),
		defineResolver({ entityType: EntityType.AcpToolCall, resolve: { PromptTurnToolCallId: { resolve: async (selector, context) => toolCallRows((await history(selector.$promptTurn.$session.sessionId, context)).toolCalls.filter((row) => row.toolCallId === selector.toolCallId), selector.$promptTurn.$session.sessionId) } } })({
			$$timestamps: (toolCall) => toolCall.observations.map((observation) => ({ [EntityMetaKey.Selector]: { $toolCall: toolCall, timestampMs: observation.timestampMs, source: observation.source }, [EntityMetaKey.Fields]: Object.fromEntries(Object.entries(observation).filter(([key]) => key !== 'timestampMs' && key !== 'source').map(([key, value]) => [entityFieldAddressKey(EntityType.AcpToolCall_Timestamp, [], key), redactAcpLocalValue(value)])) })),
		}),
		defineResolver({ entityType: EntityType.AcpToolCall_Timestamp, resolve: { ToolCallTimestampMsSource: { resolve: async (selector, context) => (await history(selector.$toolCall.$promptTurn.$session.sessionId, context)).toolCalls.flatMap((toolCall) => toolCall.observations.map((observation) => ({ [EntityMetaKey.Selector]: selector, [EntityMetaKey.Fields]: Object.fromEntries(Object.entries(observation).filter(([key]) => key !== 'timestampMs' && key !== 'source').map(([key, value]) => [entityFieldAddressKey(EntityType.AcpToolCall_Timestamp, [], key), redactAcpLocalValue(value)])) }))).filter((row) => row[EntityMetaKey.Selector].timestampMs === selector.timestampMs && row[EntityMetaKey.Selector].source === selector.source) } } })({}),
		defineResolver({ entityType: EntityType.AcpTerminal, resolve: { SessionTerminalId: { resolve: async (selector, context) => terminalRows((await history(sessionIdFrom(selector), context)).terminals.filter((row) => row.terminalId === selector.terminalId), sessionIdFrom(selector)) } } })({
			$$timestamps: (terminal) => terminal.observations.map((observation) => ({ [EntityMetaKey.Selector]: { $terminal: terminal, timestampMs: observation.timestampMs, source: observation.source } })),
		}),
		defineResolver({ entityType: EntityType.AcpTerminal_Timestamp, resolve: { TerminalTimestampMsSource: { resolve: async (selector, context) => (await history(selector.$terminal.$session.sessionId, context)).terminals.flatMap((terminal) => terminal.observations.map((observation) => ({ [EntityMetaKey.Selector]: selector, [EntityMetaKey.Fields]: Object.fromEntries(Object.entries(observation).filter(([key]) => key !== 'timestampMs' && key !== 'source').map(([key, value]) => [entityFieldAddressKey(EntityType.AcpTerminal_Timestamp, [], key), redactAcpLocalValue(value)])) }))).filter((row) => row[EntityMetaKey.Selector].timestampMs === selector.timestampMs && row[EntityMetaKey.Selector].source === selector.source) } } })({}),
		defineResolver({ entityType: EntityType.AcpFileOperation, resolve: { SessionOperationId: { resolve: async (selector, context) => (await history(sessionIdFrom(selector), context)).fileOperations.filter((row) => row.operationId === selector.operationId).map((row) => ({ [EntityMetaKey.Selector]: selector, [EntityMetaKey.Fields]: Object.fromEntries(Object.entries(row).filter(([key]) => key !== 'operationId').map(([key, value]) => [entityFieldAddressKey(EntityType.AcpFileOperation, [], key), redactAcpLocalValue(value)])) })) } } })({}),
		defineResolver({ entityType: EntityType.AcpPermissionRequest, resolve: { SessionRequestId: { resolve: async (selector, context) => permissionRows((await history(sessionIdFrom(selector), context)).permissionRequests.filter((row) => row.requestId === selector.requestId), sessionIdFrom(selector)) } } })({}),
	],
} satisfies RegisteredSourceResolverModule<Source.AcpLocal_JsonRpc>
