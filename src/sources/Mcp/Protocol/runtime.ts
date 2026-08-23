import type { McpJsonRpcTransport } from './types.ts'

export type McpLocalRuntime = {
	readonly serverKey: string
	readonly transport: McpJsonRpcTransport
}

let configuredRuntime: McpLocalRuntime | undefined

export const configureMcpLocalRuntime = (runtime: McpLocalRuntime | undefined) => {
	configuredRuntime = runtime
}

export const getMcpLocalRuntime = () => {
	if (configuredRuntime == null)
		throw new Error('McpDeclared_Protocol: local runtime unavailable')
	return configuredRuntime
}
