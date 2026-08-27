import type { JsonObject, JsonValue } from '$/typescript/JsonValue.ts'

export type JsonRpcId = string | number

export type McpJsonRpcRequest = {
	readonly jsonrpc: '2.0'
	readonly id: JsonRpcId
	readonly method: string
	readonly params?: JsonObject
}

export type McpJsonRpcResponse = {
	readonly jsonrpc: '2.0'
	readonly id: JsonRpcId | null
	readonly result?: JsonValue
	readonly error?: {
		readonly code: number
		readonly message: string
		readonly data?: JsonValue
	}
}

export type McpJsonRpcTransport = {
	readonly request: (request: McpJsonRpcRequest) => Promise<McpJsonRpcResponse>
	readonly notify?: (method: string, params?: JsonObject) => Promise<void>
}

export type McpExecutionStatus = 'connected' | 'disconnected' | 'malformed' | 'unavailable'

export type McpServerInfo = {
	readonly name: string
	readonly version: string
}

export type McpCapabilitySnapshot = {
	readonly protocolVersion: string
	readonly serverCapabilities: JsonObject
}

export type McpTool = {
	readonly name: string
	readonly title?: string
	readonly description?: string
	readonly inputSchema?: JsonValue
	readonly outputSchema?: JsonValue
	readonly annotations?: JsonValue
}

export type McpPrompt = {
	readonly name: string
	readonly title?: string
	readonly description?: string
	readonly argumentsSchema?: JsonValue
}

export type McpResource = {
	readonly uri: string
	readonly name?: string
	readonly title?: string
	readonly description?: string
	readonly mimeType?: string
	readonly annotations?: JsonValue
}

export type McpResourceTemplate = {
	readonly uriTemplate: string
	readonly name?: string
	readonly title?: string
	readonly description?: string
	readonly mimeType?: string
	readonly annotations?: JsonValue
}

export type McpCapabilityCatalog = {
	readonly tools: readonly McpTool[]
	readonly prompts: readonly McpPrompt[]
	readonly resources: readonly McpResource[]
	readonly resourceTemplates: readonly McpResourceTemplate[]
}

export type McpServerSnapshot = {
	readonly status: McpExecutionStatus
	readonly serverKey: string
	readonly server: McpServerInfo
	readonly capabilities?: McpCapabilitySnapshot
	readonly catalog?: McpCapabilityCatalog
	readonly error?: string
}
