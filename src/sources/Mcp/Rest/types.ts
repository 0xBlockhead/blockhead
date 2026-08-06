import type { JsonValue } from '$/typescript/JsonValue.ts'

type McpRepository = {
	id?: string
	source: string
	url: string
	subfolder?: string
}

type McpPackage = {
	identifier: string
	registryType: string
	registryBaseUrl?: string
	version: string
	fileSha256?: string
	runtimeHint?: string
	transport: JsonValue
	runtimeArguments?: JsonValue[]
	packageArguments?: JsonValue[]
	environmentVariables?: JsonValue[]
}

type McpServerDetail = {
	name: string
	description: string
	version: string
	title?: string
	repository?: McpRepository
	websiteUrl?: string
	packages?: McpPackage[]
	remotes?: JsonValue[]
	_meta?: JsonValue
}

type McpRegistryMetadata = {
	status?: 'active' | 'deprecated' | 'deleted'
	statusMessage?: string
	statusChangedAt?: string
	publishedAt?: string
	updatedAt?: string
	isLatest?: boolean
}

export type McpRegistryServer = {
	server: McpServerDetail
	_meta?: {
		'io.modelcontextprotocol.registry/official'?: McpRegistryMetadata
		[key: string]: JsonValue | undefined
	}
}

export type McpRegistryServers = {
	servers: McpRegistryServer[]
	metadata?: {
		nextCursor?: string | null
		count?: number
	}
}

export type McpRegistryServerListEnvelope = McpRegistryServers

export type McpRegistryServerDetailEnvelope = McpRegistryServer
