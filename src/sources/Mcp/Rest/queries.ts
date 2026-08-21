import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	McpRegistryServerDetailEnvelope,
	McpRegistryServerListEnvelope,
	McpRegistryServerVersionsEnvelope,
} from '$/sources/Mcp/Rest/types.ts'
import { type } from 'arktype'

const mcpPackageEnvelope = type({
	identifier: 'string',
	registryType: 'string',
	'registryBaseUrl?': 'string',
	version: 'string',
	'fileSha256?': 'string',
	'runtimeHint?': 'string',
	transport: 'unknown',
	'runtimeArguments?': 'unknown[]',
	'packageArguments?': 'unknown[]',
	'environmentVariables?': 'unknown[]',
})

const mcpRegistryMetadataEnvelope = type({
	'status?': "'active' | 'deprecated' | 'deleted'",
	'statusMessage?': 'string',
	'statusChangedAt?': 'string',
	'publishedAt?': 'string',
	'updatedAt?': 'string',
	'isLatest?': 'boolean',
})

const mcpRegistryServerEnvelope = type({
	name: 'string',
	description: 'string',
	version: 'string',
	'title?': 'string',
	'repository?': {
		'id?': 'string',
		source: 'string',
		url: 'string',
		'subfolder?': 'string',
	},
	'websiteUrl?': 'string',
	'packages?': mcpPackageEnvelope.array(),
	'remotes?': 'unknown[]',
	'_meta?': 'object',
})

const registryServerResponseEnvelope = type({
	server: mcpRegistryServerEnvelope,
	'_meta?': {
		'io.modelcontextprotocol.registry/official?': mcpRegistryMetadataEnvelope,
	},
})

const registryServerListEnvelope = type({
	servers: registryServerResponseEnvelope.array(),
	'metadata?': {
		'nextCursor?': 'string | null',
		'count?': 'number',
	},
})

const registryServerDetailEnvelope = registryServerResponseEnvelope

const registryServerVersionsEnvelope = registryServerListEnvelope

type RegistryServerListOptions = {
	cursor?: string
	limit?: number
	search?: string
	updatedSince?: string
	version?: string
	includeDeleted?: boolean
}

const assertRegistryServerListEnvelope = (
	response: McpRegistryServerListEnvelope
) => {
	try {
		registryServerListEnvelope.assert(response)
	} catch {
		throw new Error('McpPackageRegistry_Rest: invalid server list response envelope')
	}
	return response
}

const assertRegistryServerDetailEnvelope = (
	response: McpRegistryServerDetailEnvelope
) => {
	try {
		registryServerDetailEnvelope.assert(response)
	} catch {
		throw new Error('McpPackageRegistry_Rest: invalid server detail response envelope')
	}
	return response
}

const assertRegistryServerVersionsEnvelope = (
	response: McpRegistryServerVersionsEnvelope
) => {
	try {
		registryServerVersionsEnvelope.assert(response)
	} catch {
		throw new Error('McpPackageRegistry_Rest: invalid server versions response envelope')
	}
	return response
}

const assertRegistryServerName = (serverName: string) => {
	if (serverName.trim().length === 0)
		throw new Error('McpPackageRegistry_Rest: server name must not be empty')
}

const assertRegistryServerVersion = (version: string) => {
	if (version.trim().length === 0)
		throw new Error('McpPackageRegistry_Rest: server version must not be empty')
}

const assertRegistryServerListOptions = (options: RegistryServerListOptions) => {
	if (options.cursor === '')
		throw new Error('McpPackageRegistry_Rest: cursor must not be empty')
	if (options.limit != null && (!Number.isSafeInteger(options.limit) || options.limit < 1))
		throw new Error('McpPackageRegistry_Rest: limit must be a positive safe integer')
}

export const getRegistryServers = (
	binding: SourceBinding,
	options: RegistryServerListOptions = {}
) => {
	if (binding.source !== Source.McpPackageRegistry_Rest)
		throw new Error('MCP registry server list requires McpPackageRegistry_Rest binding')
	assertRegistryServerListOptions(options)

	const query = new URLSearchParams()
	if (options.cursor != null) query.set('cursor', options.cursor)
	if (options.limit != null) query.set('limit', String(options.limit))
	if (options.search != null) query.set('search', options.search)
	if (options.updatedSince != null) query.set('updated_since', options.updatedSince)
	if (options.version != null) query.set('version', options.version)
	if (options.includeDeleted != null) query.set('include_deleted', String(options.includeDeleted))

	return getJson<McpRegistryServerListEnvelope>(
		binding,
		query.size === 0 ? '' : `?${query.toString()}`
	).then(assertRegistryServerListEnvelope)
}

export const getRegistryServerVersions = (
	binding: SourceBinding,
	serverName: string,
	options: Omit<RegistryServerListOptions, 'version'> = {}
) => {
	if (binding.source !== Source.McpPackageRegistry_Rest)
		throw new Error('MCP registry server version list requires McpPackageRegistry_Rest binding')
	assertRegistryServerName(serverName)
	assertRegistryServerListOptions(options)

	const query = new URLSearchParams()
	if (options.cursor != null) query.set('cursor', options.cursor)
	if (options.limit != null) query.set('limit', String(options.limit))
	if (options.updatedSince != null) query.set('updated_since', options.updatedSince)
	if (options.includeDeleted != null) query.set('include_deleted', String(options.includeDeleted))

	return getJson<McpRegistryServerVersionsEnvelope>(
		binding,
		`${encodeURIComponent(serverName)}/versions${query.size === 0 ? '' : `?${query.toString()}`}`
	).then(assertRegistryServerVersionsEnvelope)
}

export const getRegistryServer = (
	binding: SourceBinding,
	serverName: string,
	version = 'latest',
) => {
	if (binding.source !== Source.McpPackageRegistry_Rest)
		throw new Error('MCP registry server detail requires McpPackageRegistry_Rest binding')
	assertRegistryServerName(serverName)
	assertRegistryServerVersion(version)

	return getJson<McpRegistryServerDetailEnvelope>(
		binding,
		`${encodeURIComponent(serverName)}/versions/${encodeURIComponent(version)}?include_deleted=true`
	).then(assertRegistryServerDetailEnvelope)
}
