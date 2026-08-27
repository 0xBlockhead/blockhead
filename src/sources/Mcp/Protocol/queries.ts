import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	isJsonObject,
	isJsonString,
	type JsonObject,
	type JsonValue,
} from '$/typescript/JsonValue.ts'
import type {
	McpCapabilityCatalog,
	McpCapabilitySnapshot,
	McpJsonRpcResponse,
	McpJsonRpcTransport,
	McpPrompt,
	McpResource,
	McpResourceTemplate,
	McpServerSnapshot,
	McpTool,
} from '$/sources/Mcp/Protocol/types.ts'

const protocolVersion = '2025-06-18'

const protocolError = (method: string, response: McpJsonRpcResponse) => (
	response.error == null ? undefined : `McpDeclared_Protocol: ${method}: ${response.error.message}`
)

const resultFor = (method: string, response: McpJsonRpcResponse, expectedId: number) => {
	if (response.jsonrpc !== '2.0' || response.id !== expectedId || response.result == null || response.error != null)
		throw new Error(protocolError(method, response) ?? `McpDeclared_Protocol: ${method}: malformed JSON-RPC response`)
	return response.result
}

const objectResultFor = (method: string, response: McpJsonRpcResponse, expectedId: number) => {
	const result = resultFor(method, response, expectedId)
	if (!isJsonObject(result))
		throw new Error(`McpDeclared_Protocol: ${method}: malformed result object`)
	return result
}

const stringField = (object: JsonObject, field: string, method: string) => {
	const value = object[field]
	if (typeof value !== 'string' || value === '')
		throw new Error(`McpDeclared_Protocol: ${method}: malformed ${field}`)
	return value
}

const optionalString = (object: JsonObject, field: string) => {
	const value = object[field]
	return value == null ? undefined : isJsonString(value) ? value : undefined
}

const listResult = (method: string, response: McpJsonRpcResponse, expectedId: number, field: string) => {
	const result = objectResultFor(method, response, expectedId)[field]
	if (!Array.isArray(result))
		throw new Error(`McpDeclared_Protocol: ${method}: malformed ${field}`)
	return result
}

const toolFrom = (value: JsonValue, method: string): McpTool => {
	if (!isJsonObject(value))
		throw new Error(`McpDeclared_Protocol: ${method}: malformed tool`)
	return {
		name: stringField(value, 'name', method),
		...(optionalString(value, 'title') != null && { title: optionalString(value, 'title') }),
		...(optionalString(value, 'description') != null && { description: optionalString(value, 'description') }),
		...(value.inputSchema != null && { inputSchema: value.inputSchema }),
		...(value.outputSchema != null && { outputSchema: value.outputSchema }),
		...(value.annotations != null && { annotations: value.annotations }),
	}
}

const promptFrom = (value: JsonValue, method: string): McpPrompt => {
	if (!isJsonObject(value))
		throw new Error(`McpDeclared_Protocol: ${method}: malformed prompt`)
	return {
		name: stringField(value, 'name', method),
		...(optionalString(value, 'title') != null && { title: optionalString(value, 'title') }),
		...(optionalString(value, 'description') != null && { description: optionalString(value, 'description') }),
		...(value.arguments != null && { argumentsSchema: value.arguments }),
	}
}

const resourceFrom = (value: JsonValue, method: string): McpResource => {
	if (!isJsonObject(value))
		throw new Error(`McpDeclared_Protocol: ${method}: malformed resource`)
	return {
		uri: stringField(value, 'uri', method),
		...(optionalString(value, 'name') != null && { name: optionalString(value, 'name') }),
		...(optionalString(value, 'title') != null && { title: optionalString(value, 'title') }),
		...(optionalString(value, 'description') != null && { description: optionalString(value, 'description') }),
		...(optionalString(value, 'mimeType') != null && { mimeType: optionalString(value, 'mimeType') }),
		...(value.annotations != null && { annotations: value.annotations }),
	}
}

const templateFrom = (value: JsonValue, method: string): McpResourceTemplate => {
	if (!isJsonObject(value))
		throw new Error(`McpDeclared_Protocol: ${method}: malformed resource template`)
	return {
		uriTemplate: stringField(value, 'uriTemplate', method),
		...(optionalString(value, 'name') != null && { name: optionalString(value, 'name') }),
		...(optionalString(value, 'title') != null && { title: optionalString(value, 'title') }),
		...(optionalString(value, 'description') != null && { description: optionalString(value, 'description') }),
		...(optionalString(value, 'mimeType') != null && { mimeType: optionalString(value, 'mimeType') }),
		...(value.annotations != null && { annotations: value.annotations }),
	}
}

const request = async (transport: McpJsonRpcTransport, id: number, method: string, params?: JsonObject) => (
	transport.request({ jsonrpc: '2.0', id, method, ...(params != null && { params }) })
)

export const discoverMcpServer = async (
	binding: SourceBinding,
	serverKey: string,
	transport: McpJsonRpcTransport
): Promise<McpServerSnapshot> => {
	if (binding.source !== Source.McpDeclared_Protocol)
		throw new Error('McpDeclared_Protocol: discovery requires declared-protocol binding')
	try {
		const initialized = objectResultFor('initialize', await request(transport, 1, 'initialize', {
			protocolVersion,
			capabilities: {},
			clientInfo: { name: 'blockhead', version: '0.0.1' },
		}), 1)
		const serverInfo = initialized.serverInfo
		if (!isJsonObject(serverInfo))
			throw new Error('McpDeclared_Protocol: initialize: malformed serverInfo')
		const server = {
			name: stringField(serverInfo, 'name', 'initialize'),
			version: stringField(serverInfo, 'version', 'initialize'),
		}
		await transport.notify?.('notifications/initialized')
		const capabilities = {
			protocolVersion: stringField(initialized, 'protocolVersion', 'initialize'),
			serverCapabilities: initialized.capabilities == null || !isJsonObject(initialized.capabilities) ? {} : initialized.capabilities,
		} satisfies McpCapabilitySnapshot
		const catalog = {
			tools: listResult('tools/list', await request(transport, 2, 'tools/list'), 2, 'tools').map((value) => toolFrom(value, 'tools/list')),
			prompts: listResult('prompts/list', await request(transport, 3, 'prompts/list'), 3, 'prompts').map((value) => promptFrom(value, 'prompts/list')),
			resources: listResult('resources/list', await request(transport, 4, 'resources/list'), 4, 'resources').map((value) => resourceFrom(value, 'resources/list')),
			resourceTemplates: listResult('resources/templates/list', await request(transport, 5, 'resources/templates/list'), 5, 'resourceTemplates').map((value) => templateFrom(value, 'resources/templates/list')),
		} satisfies McpCapabilityCatalog
		return { status: 'connected', serverKey, server, capabilities, catalog }
	} catch (error) {
		const message = String(error)
		return {
			status: message.includes('malformed') ? 'malformed' : 'disconnected',
			serverKey,
			server: { name: serverKey, version: 'unavailable' },
			error: message,
		}
	}
}
