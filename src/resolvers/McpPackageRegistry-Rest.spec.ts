import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityType } from '$/schema/EntityType.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import bindings from '$/sources/Mcp/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getRegistryServer = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Mcp/Rest/queries.ts', () => ({
	getRegistryServer,
}))

const { default: registryResolvers } = await import('$/resolvers/McpPackageRegistry-Rest.ts')
const packageResolver = registryResolvers.resolvers.find((resolver) => resolver.entityType === EntityType.McpServerPackage)
const versionResolver = registryResolvers.resolvers.find((resolver) => resolver.entityType === EntityType.McpServerPackageVersion)
if (
	packageResolver == null
	|| !('RegistryServerName' in packageResolver.resolve)
	|| versionResolver == null
	|| !('PackageVersion' in versionResolver.resolve)
)
	throw new Error('MCP registry resolver spec missing package resolvers')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
	sourceBinding: bindings[Source.McpPackageRegistry_Rest][0],
}

beforeEach(() => {
	getRegistryServer.mockReset()
})

it('connects registry package identity, repository and exact published version metadata', async () => {
	getRegistryServer.mockResolvedValue({
		server: {
			name: 'io.example/server',
			title: 'Example server',
			description: 'Example MCP server',
			version: '1.2.3',
			repository: {
				source: 'github',
				url: 'https://github.com/example/server',
			},
			packages: [{
				identifier: '@example/mcp-server',
				registryType: 'npm',
				registryBaseUrl: 'https://registry.npmjs.org',
				version: '1.2.3',
				runtimeHint: 'npx',
				transport: { type: 'stdio' },
				packageArguments: ['--readonly'],
			}],
			remotes: [{ type: 'streamable-http', url: 'https://mcp.example' }],
		},
		_meta: {
			'io.modelcontextprotocol.registry/official': {
				status: 'active',
				publishedAt: '2026-08-01T12:00:00.000Z',
				isLatest: true,
			},
		},
	})

	await expect(packageResolver.resolve.RegistryServerName.resolve({
		registryServerName: 'io.example/server',
	}, context)).resolves.toEqual({
		registryServerName: 'io.example/server',
		label: 'Example server',
		repositoryUrl: 'https://github.com/example/server',
	})
	await expect(versionResolver.resolve.PackageVersion.resolve({
		$package: { registryServerName: 'io.example/server' },
		version: '1.2.3',
	}, context)).resolves.toMatchObject({
		$package: {
			[EntityMetaKey.Selector]: { registryServerName: 'io.example/server' },
		},
		version: '1.2.3',
		registryStatus: 'active',
		publishedAt: 1_785_585_600_000,
		isLatest: true,
		packageRegistryType: 'npm',
		packageRegistryBaseUrl: 'https://registry.npmjs.org',
		packageIdentifier: '@example/mcp-server',
		runtimeHint: 'npx',
		transportKind: 'stdio',
		packageArguments: ['--readonly'],
	})
	expect(getRegistryServer).toHaveBeenNthCalledWith(
		2,
		context.sourceBinding,
		'io.example/server',
		'1.2.3'
	)
})

it('fails closed on registry and version identity drift and malformed publication clocks', async () => {
	getRegistryServer.mockResolvedValueOnce({
		server: {
			name: 'io.example/other',
			version: '1.2.3',
		},
	})
	await expect(packageResolver.resolve.RegistryServerName.resolve({
		registryServerName: 'io.example/server',
	}, context)).rejects.toThrow('server identity mismatch')

	getRegistryServer.mockResolvedValueOnce({
		server: {
			name: 'io.example/server',
			version: '2.0.0',
		},
	})
	await expect(versionResolver.resolve.PackageVersion.resolve({
		$package: { registryServerName: 'io.example/server' },
		version: '1.2.3',
	}, context)).rejects.toThrow('version identity mismatch')

	getRegistryServer.mockResolvedValueOnce({
		server: {
			name: 'io.example/server',
			version: '1.2.3',
		},
		_meta: {
			'io.modelcontextprotocol.registry/official': {
				publishedAt: 'not-a-clock',
			},
		},
	})
	await expect(versionResolver.resolve.PackageVersion.resolve({
		$package: { registryServerName: 'io.example/server' },
		version: '1.2.3',
	}, context)).rejects.toThrow('invalid publishedAt')
})
