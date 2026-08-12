import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { McpRegistryServer } from '$/sources/Mcp/Rest/types.ts'
import {
	isJsonObject,
	isJsonString,
} from '$/typescript/JsonValue.ts'

const registryMetadata = (response: McpRegistryServer) => (
	response._meta?.['io.modelcontextprotocol.registry/official']
)

const registryTimestampMs = (
	value: string | undefined,
	label: string
) => {
	if (value == null)
		return undefined

	const timestampMs = Date.parse(value)
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error(`McpPackageRegistry_Rest: invalid ${label}`)

	return timestampMs
}

const registryServer = async (
	registryServerName: string,
	version: string,
	context: ResolverContext
) => {
	const response = (
		typeof window === 'undefined' ?
			await import('$/sources/Mcp/Rest/queries.ts').then(({ getRegistryServer }) => (
				getRegistryServer(context.sourceBinding, registryServerName, version)
			))
		:
			await import('$/sources/Mcp/Rest/queries.remote.ts').then(({ getRegistryServerRemote }) => (
				getRegistryServerRemote({
					registryServerName,
					version,
				})
			))
	)
	if (response.server.name !== registryServerName)
		throw new Error(`McpPackageRegistry_Rest: server identity mismatch ${response.server.name} !== ${registryServerName}`)
	if (version !== 'latest' && response.server.version !== version)
		throw new Error(`McpPackageRegistry_Rest: version identity mismatch ${response.server.version} !== ${version}`)

	return response
}

export default {
	source: Source.McpPackageRegistry_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.McpServerPackage,
			resolve: {
				RegistryServerName: {
					resolve: async ({ registryServerName }, context) => {
						const response = await registryServer(registryServerName, 'latest', context)
						return {
							registryServerName,
							label: response.server.title ?? response.server.name,
							...(response.server.repository != null && { repositoryUrl: response.server.repository.url }),
						}
					},
				},
			},
		})({
			registryServerName: (serverPackage) => serverPackage.registryServerName,
			repositoryUrl: (serverPackage) => serverPackage.repositoryUrl,
			label: (serverPackage) => serverPackage.label,
		}),

		defineResolver({
			entityType: EntityType.McpServerPackageVersion,
			resolve: {
				PackageVersion: {
					resolve: async ({ $package, version }, context) => {
						if ($package?.registryServerName == null || version == null)
							throw new Error('McpPackageRegistry_Rest: package version requires registry identity')

						const response = await registryServer($package.registryServerName, version, context)
						const metadata = registryMetadata(response)
						const packageDefinition = response.server.packages?.find((candidate) => candidate.version === version)
						const publishedAt = registryTimestampMs(metadata?.publishedAt, 'publishedAt')
						return {
							$package: {
								[EntityMetaKey.Selector]: {
									registryServerName: $package.registryServerName,
								},
							},
							version,
							...(metadata?.status != null && { registryStatus: metadata.status }),
							...(publishedAt != null && {
								publishedAt,
							}),
							...(metadata?.isLatest != null && { isLatest: metadata.isLatest }),
							...(packageDefinition != null && {
								packageRegistryType: packageDefinition.registryType,
								...(packageDefinition.registryBaseUrl != null && { packageRegistryBaseUrl: packageDefinition.registryBaseUrl }),
								packageIdentifier: packageDefinition.identifier,
								...(packageDefinition.runtimeHint != null && { runtimeHint: packageDefinition.runtimeHint }),
								...(isJsonObject(packageDefinition.transport) && isJsonString(packageDefinition.transport.type) && {
									transportKind: packageDefinition.transport.type,
								}),
								packages: response.server.packages,
								...(packageDefinition.packageArguments != null && { packageArguments: packageDefinition.packageArguments }),
								...(packageDefinition.runtimeArguments != null && { runtimeArguments: packageDefinition.runtimeArguments }),
								...(packageDefinition.environmentVariables != null && { environmentVariables: packageDefinition.environmentVariables }),
							}),
							...(response.server.remotes != null && { remotes: response.server.remotes }),
							...(response._meta != null && { publisherMeta: response._meta }),
						}
					},
				},
			},
		})({
			$package: (serverPackageVersion) => serverPackageVersion.$package,
			version: (serverPackageVersion) => serverPackageVersion.version,
			registryStatus: (serverPackageVersion) => serverPackageVersion.registryStatus,
			publishedAt: (serverPackageVersion) => serverPackageVersion.publishedAt,
			isLatest: (serverPackageVersion) => serverPackageVersion.isLatest,
			packageRegistryType: (serverPackageVersion) => serverPackageVersion.packageRegistryType,
			packageRegistryBaseUrl: (serverPackageVersion) => serverPackageVersion.packageRegistryBaseUrl,
			packageIdentifier: (serverPackageVersion) => serverPackageVersion.packageIdentifier,
			runtimeHint: (serverPackageVersion) => serverPackageVersion.runtimeHint,
			transportKind: (serverPackageVersion) => serverPackageVersion.transportKind,
			packages: (serverPackageVersion) => serverPackageVersion.packages,
			remotes: (serverPackageVersion) => serverPackageVersion.remotes,
			packageArguments: (serverPackageVersion) => serverPackageVersion.packageArguments,
			runtimeArguments: (serverPackageVersion) => serverPackageVersion.runtimeArguments,
			environmentVariables: (serverPackageVersion) => serverPackageVersion.environmentVariables,
			publisherMeta: (serverPackageVersion) => serverPackageVersion.publisherMeta,
		}),
	],
} satisfies RegisteredSourceResolverModule
