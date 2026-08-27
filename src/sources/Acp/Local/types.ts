export type AcpLocalHealth = 'ready' | 'disconnected' | 'malformed' | 'unavailable'

export type AcpLocalJsonRpcRequest = {
	readonly jsonrpc: '2.0'
	readonly id: string
	readonly method: string
	readonly params?: unknown
}

export type AcpLocalJsonRpcResponse = {
	readonly jsonrpc: '2.0'
	readonly id: string
	readonly result?: unknown
	readonly error?: {
		readonly code: number
		readonly message: string
		readonly data?: unknown
	}
}

export type AcpLocalRuntime = {
	readonly runtimeId: string
	readonly transportKind: string
	readonly processId?: string
	readonly initializedAt?: number
	readonly initialize: () => Promise<AcpLocalInitializeResult>
	readonly readSession: (sessionId: string) => Promise<AcpLocalSessionSnapshot>
	readonly listSessions: () => Promise<readonly AcpLocalSessionSnapshot[]>
	readonly readHistory: (sessionId: string, boundary: AcpLocalHistoryBoundary) => Promise<AcpLocalHistorySnapshot>
}

export type AcpLocalInitializeResult = {
	readonly protocolVersion?: string
	readonly supportedProtocolVersions?: readonly string[]
	readonly agentCapabilities?: unknown
	readonly clientCapabilities?: unknown
	readonly authMethods?: unknown
	readonly agentInfo?: unknown
	readonly clientInfo?: unknown
}

export type AcpLocalHistoryBoundary = {
	readonly beforeSequence?: number
	readonly limit: number
}

export type AcpLocalSessionSnapshot = {
	readonly sessionId: string
	readonly runtimeId: string
	readonly createdAt?: number
	readonly closedAt?: number
	readonly deletedAt?: number
	readonly loadedFromSessionId?: string
	readonly workspaceUri?: string
	readonly mode?: string
	readonly listed?: boolean
	readonly status?: string
}

export type AcpLocalHistorySnapshot = {
	readonly sessionId: string
	readonly sequenceStart: number
	readonly sequenceEnd: number
	readonly updates: readonly AcpLocalSessionUpdate[]
	readonly messages: readonly AcpLocalMessage[]
	readonly turns: readonly AcpLocalTurn[]
	readonly toolCalls: readonly AcpLocalToolCall[]
	readonly terminals: readonly AcpLocalTerminal[]
	readonly fileOperations: readonly AcpLocalFileOperation[]
	readonly permissionRequests: readonly AcpLocalPermissionRequest[]
}

export type AcpLocalSessionUpdate = { readonly sequence: number; readonly updateKind: string; readonly timestampMs?: number; readonly payload?: unknown }
export type AcpLocalMessagePart = { readonly partIndex: number; readonly partKind: string; readonly text?: string; readonly uri?: string; readonly mimeType?: string; readonly payload?: unknown }
export type AcpLocalMessage = { readonly messageId: string; readonly role: string; readonly createdAt?: number; readonly parts: readonly AcpLocalMessagePart[] }
export type AcpLocalTurn = { readonly turnId: string; readonly startedAt?: number; readonly completedAt?: number; readonly cancelledAt?: number; readonly stopReason?: string; readonly userPromptHashAlgorithm?: string; readonly userPromptHash?: string; readonly toolCallIds: readonly string[] }
export type AcpLocalToolCall = { readonly toolCallId: string; readonly turnId: string; readonly toolName?: string; readonly serverName?: string; readonly startedAt?: number; readonly completedAt?: number; readonly inputHashAlgorithm?: string; readonly inputHash?: string; readonly outputHashAlgorithm?: string; readonly outputHash?: string; readonly observations: readonly AcpLocalToolCallObservation[] }
export type AcpLocalToolCallObservation = { readonly timestampMs: number; readonly source: string; readonly status?: string; readonly latencyMs?: number; readonly error?: string; readonly payload?: unknown }
export type AcpLocalTerminal = { readonly terminalId: string; readonly command?: string; readonly cwd?: string; readonly createdAt?: number; readonly releasedAt?: number; readonly observations: readonly AcpLocalTerminalObservation[] }
export type AcpLocalTerminalObservation = { readonly timestampMs: number; readonly source: string; readonly exitCode?: number; readonly status?: string; readonly outputBytes?: number; readonly error?: string }
export type AcpLocalFileOperation = { readonly operationId: string; readonly operationKind: string; readonly path?: string; readonly startLine?: number; readonly endLine?: number; readonly contentHashAlgorithm?: string; readonly contentHash?: string; readonly timestampMs?: number; readonly status?: string; readonly error?: string }
export type AcpLocalPermissionRequest = { readonly requestId: string; readonly requestKind: string; readonly createdAt?: number; readonly resolvedAt?: number; readonly decision?: string; readonly payload?: unknown }
