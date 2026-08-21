import { type } from 'arktype'
import type { AcpLocalAuthorization, AcpLocalJsonRpcRequest, AcpLocalJsonRpcResponse } from './types.ts'

const responseType = type({
	jsonrpc: '"2.0"',
	id: 'string',
	'result?': 'unknown',
	'error?': {
		code: 'number',
		message: 'string',
		'data?': 'unknown',
	},
})

export type AcpLocalJsonRpcTransport = {
	readonly request: (method: string, params?: unknown, authorization?: AcpLocalAuthorization) => Promise<unknown>
	readonly disconnect: () => void
}

export const parseAcpLocalJsonRpcResponse = (payload: string, requestId: string): AcpLocalJsonRpcResponse => {
	let parsed: unknown
	try {
		parsed = JSON.parse(payload)
	} catch (error) {
		throw new Error(`AcpLocal_JsonRpc: malformed response: ${String(error)}`)
	}
	const response = responseType(parsed)
	if (response instanceof type.errors)
		throw new Error(`AcpLocal_JsonRpc: malformed response: ${response.summary}`)
	if (response.id !== requestId)
		throw new Error(`AcpLocal_JsonRpc: response id mismatch`)
	return response
}

export const createAcpLocalJsonRpcTransport = ({
	send,
	authorize = () => ({ allow: false, reason: 'mutation authorization is required' }),
	id = () => `acp-${Date.now()}`,
}: {
	readonly send: (request: AcpLocalJsonRpcRequest) => Promise<string>
	readonly authorize?: (method: string, params: unknown) => AcpLocalAuthorization
	readonly id?: () => string
}): AcpLocalJsonRpcTransport => {
	let connected = true
	return {
		async request(method, params, authorization) {
			if (!connected)
				throw new Error('AcpLocal_JsonRpc: disconnected')
			const mutation = method !== 'initialize' && method !== 'session/list' && method !== 'session/read' && method !== 'session/history'
			if (mutation && !(authorization?.allow ?? authorize(method, params).allow))
				throw new Error(`AcpLocal_JsonRpc: unauthorized mutation ${method}`)
			const requestId = id()
			const response = parseAcpLocalJsonRpcResponse(await send({ jsonrpc: '2.0', id: requestId, method, ...(params !== undefined && { params }) }), requestId)
			if (response.error != null)
				throw new Error(`AcpLocal_JsonRpc: ${response.error.message}`)
			return response.result
		},
		disconnect() {
			connected = false
		},
	}
}
