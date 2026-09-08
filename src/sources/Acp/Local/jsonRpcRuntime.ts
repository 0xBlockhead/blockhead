import { type } from 'arktype'
import { createAcpLocalRuntime } from './runtime.ts'
import type { AcpLocalJsonRpcTransport } from './transport.ts'
import type { AcpLocalHistoryBoundary } from './types.ts'

const initializeResultType = type({
	'protocolVersion?': 'string',
	'supportedProtocolVersions?': 'string[]',
	'agentCapabilities?': 'unknown',
	'clientCapabilities?': 'unknown',
	'authMethods?': 'unknown',
	'agentInfo?': 'unknown',
	'clientInfo?': 'unknown',
})

const sessionType = type({
	sessionId: 'string',
	runtimeId: 'string',
	'createdAt?': 'number',
	'closedAt?': 'number',
	'deletedAt?': 'number',
	'loadedFromSessionId?': 'string',
	'workspaceUri?': 'string',
	'mode?': 'string',
	'listed?': 'boolean',
	'status?': 'string',
})

const updateType = type({
	sequence: 'number',
	updateKind: 'string',
	'timestampMs?': 'number',
	'payload?': 'unknown',
})
const messagePartType = type({
	partIndex: 'number',
	partKind: 'string',
	'text?': 'string',
	'uri?': 'string',
	'mimeType?': 'string',
	'payload?': 'unknown',
})
const messageType = type({
	messageId: 'string',
	role: 'string',
	'createdAt?': 'number',
	parts: messagePartType.array(),
})
const turnType = type({
	turnId: 'string',
	'startedAt?': 'number',
	'completedAt?': 'number',
	'cancelledAt?': 'number',
	'stopReason?': 'string',
	'userPromptHashAlgorithm?': 'string',
	'userPromptHash?': 'string',
	toolCallIds: 'string[]',
})
const toolCallObservationType = type({
	timestampMs: 'number',
	source: 'string',
	'status?': 'string',
	'latencyMs?': 'number',
	'error?': 'string',
	'payload?': 'unknown',
})
const toolCallType = type({
	toolCallId: 'string',
	turnId: 'string',
	'toolName?': 'string',
	'serverName?': 'string',
	'startedAt?': 'number',
	'completedAt?': 'number',
	'inputHashAlgorithm?': 'string',
	'inputHash?': 'string',
	'outputHashAlgorithm?': 'string',
	'outputHash?': 'string',
	observations: toolCallObservationType.array(),
})
const terminalObservationType = type({
	timestampMs: 'number',
	source: 'string',
	'exitCode?': 'number',
	'status?': 'string',
	'outputBytes?': 'number',
	'error?': 'string',
})
const terminalType = type({
	terminalId: 'string',
	'command?': 'string',
	'cwd?': 'string',
	'createdAt?': 'number',
	'releasedAt?': 'number',
	observations: terminalObservationType.array(),
})
const fileOperationType = type({
	operationId: 'string',
	operationKind: 'string',
	'path?': 'string',
	'startLine?': 'number',
	'endLine?': 'number',
	'contentHashAlgorithm?': 'string',
	'contentHash?': 'string',
	'timestampMs?': 'number',
	'status?': 'string',
	'error?': 'string',
})
const permissionRequestType = type({
	requestId: 'string',
	requestKind: 'string',
	'createdAt?': 'number',
	'resolvedAt?': 'number',
	'decision?': 'string',
	'payload?': 'unknown',
})
const historyType = type({
	sessionId: 'string',
	sequenceStart: 'number',
	sequenceEnd: 'number',
	updates: updateType.array(),
	messages: messageType.array(),
	turns: turnType.array(),
	toolCalls: toolCallType.array(),
	terminals: terminalType.array(),
	fileOperations: fileOperationType.array(),
	permissionRequests: permissionRequestType.array(),
})

const parse = <_Type>(schema: (value: unknown) => _Type | type.errors, value: unknown, label: string): _Type => {
	const parsed = schema(value)
	if (parsed instanceof type.errors)
		throw new Error(`AcpLocal_JsonRpc: malformed ${label}: ${parsed.summary}`)
	return parsed
}

export const createAcpLocalJsonRpcRuntime = ({
	runtimeId,
	transportKind,
	processId,
	initializedAt,
	transport,
}: {
	readonly runtimeId: string
	readonly transportKind: string
	readonly processId?: string
	readonly initializedAt?: number
	readonly transport: AcpLocalJsonRpcTransport
}) => createAcpLocalRuntime({
	runtimeId,
	transportKind,
	...(processId != null && { processId }),
	...(initializedAt != null && { initializedAt }),
	initialize: async () => parse(initializeResultType, await transport.request('initialize'), 'initialize result'),
	readSession: async (sessionId) => parse(sessionType, await transport.request('session/read', { sessionId }), 'session result'),
	listSessions: async () => parse(sessionType.array(), await transport.request('session/list'), 'session list result'),
	readHistory: async (sessionId, boundary: AcpLocalHistoryBoundary) => parse(historyType, await transport.request('session/history', { sessionId, ...boundary }), 'history result'),
})
