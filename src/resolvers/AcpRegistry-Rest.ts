import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import type {
	AcpRegistry,
	AcpRegistryAgent,
	AcpRegistryDistribution,
} from '$/sources/Acp/Rest/types.ts'

const packageNameFromDistribution = (
	distribution: AcpRegistryDistribution
) => {
	const runners = [
		distribution.npx,
		distribution.uvx,
	].flatMap((runner) => (
		runner == null ? [] : [runner.package]
	))
	return runners.length === 1 ? runners[0] : undefined
}

const programReference = (
	agent: AcpRegistryAgent
) => ({
	[EntityMetaKey.Selector]: {
		registryAgentId: agent.id,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'registryAgentId')]:
			agent.id,
		[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'label')]:
			agent.name,
		...(agent.authors != null && agent.authors.length > 0 && {
			[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'authors')]:
				agent.authors,
		}),
		...(
			agent.repository != null
			&& UrlString.allows(agent.repository)
			&& {
				[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'repositoryUrl')]:
					agent.repository,
			}
		),
		...(
			((packageName) => (
				packageName == null ?
					{}
				:
					{
						[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'packageName')]:
							packageName,
					}
			))(packageNameFromDistribution(agent.distribution))
		),
	},
})

const findRegistryAgent = (
	registry: AcpRegistry,
	registryAgentId: string,
	version?: string
) => (
	registry.agents.find((candidate) => (
		candidate.id === registryAgentId
		&& (version == null || candidate.version === version)
	))
)

const unambiguousBinaryTarget = (
	distribution: AcpRegistryDistribution
) => {
	const binary = distribution.binary
	return binary == null || Object.keys(binary).length !== 1 ?
		undefined
	:
		Object.values(binary)[0]
}

const distributionKind = (
	distribution: AcpRegistryDistribution
) => (
	Object.keys(distribution).length === 1 ?
		Object.keys(distribution)[0]
	:
		undefined
)

export default {
	source: Source.AcpRegistry_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.AcpAgentProgram,
			resolve: {
				RegistryAgentId: {
					resolve: async ({
						registryAgentId,
					}) => {
						const { fetchRegistry } = await import('$/sources/Acp/Rest/queries.ts')
						const agent = findRegistryAgent(await fetchRegistry(), registryAgentId)
						if (agent == null)
							throw new Error(`AcpRegistry_Rest: registry agent ${registryAgentId} was not found`)

						return agent
					},
				},
				PackageName: {
					resolve: async ({
						packageName,
					}) => {
						const { fetchRegistry } = await import('$/sources/Acp/Rest/queries.ts')
						const agent = (await fetchRegistry()).agents.find((candidate) => (
							packageNameFromDistribution(candidate.distribution) === packageName
						))
						if (agent == null)
							throw new Error(`AcpRegistry_Rest: registry package ${packageName} was not found`)

						return agent
					},
				},
				RepositoryUrl: {
					resolve: async ({
						repositoryUrl,
					}) => {
						const { fetchRegistry } = await import('$/sources/Acp/Rest/queries.ts')
						const agent = (await fetchRegistry()).agents.find((candidate) => (
							candidate.repository === repositoryUrl
						))
						if (agent == null)
							throw new Error(`AcpRegistry_Rest: registry repository ${repositoryUrl} was not found`)

						return agent
					},
				},
			},
		})({
			registryAgentId: (agent) => agent.id,
			label: (agent) => agent.name,
			authors: (agent) => (
				agent.authors != null && agent.authors.length > 0 ?
					agent.authors
				:
					undefined
			),
			repositoryUrl: (agent) => (
				agent.repository != null && UrlString.allows(agent.repository) ?
					agent.repository
				:
					undefined
			),
			packageName: (agent) => packageNameFromDistribution(agent.distribution),
		}),

		defineResolver({
			entityType: EntityType.AcpAgentProgramVersion,
			resolve: {
				ProgramVersion: {
					resolve: async ({
						$program,
						version,
					}) => {
						if (!('registryAgentId' in $program))
							throw new Error('AcpRegistry_Rest: program selector must identify a registry agent')

						const { fetchRegistry } = await import('$/sources/Acp/Rest/queries.ts')
						const agent = findRegistryAgent(
							await fetchRegistry(),
							$program.registryAgentId,
							version
						)
						if (agent == null)
							throw new Error(`AcpRegistry_Rest: registry agent ${$program.registryAgentId}@${version} was not found`)

						return agent
					},
				},
			},
		})({
			$program: (agent) => ({
				[EntityMetaKey.Selector]: {
					registryAgentId: agent.id,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'registryAgentId')]:
						agent.id,
					[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'label')]:
						agent.name,
					...(agent.authors != null && agent.authors.length > 0 && {
						[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'authors')]:
							agent.authors,
					}),
					...(
						agent.repository != null
						&& UrlString.allows(agent.repository)
						&& {
							[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'repositoryUrl')]:
								agent.repository,
						}
					),
					...(
						((packageName) => (
							packageName == null ?
								{}
							:
								{
									[entityFieldAddressKey(EntityType.AcpAgentProgram, [], 'packageName')]:
										packageName,
								}
						))(packageNameFromDistribution(agent.distribution))
					),
				},
			}),
			version: (agent) => agent.version,
			distributionKind: (agent) => distributionKind(agent.distribution),
			command: (agent) => unambiguousBinaryTarget(agent.distribution)?.cmd,
			arguments: (agent) => {
				if (Object.keys(agent.distribution).length !== 1)
					return undefined

				const binary = unambiguousBinaryTarget(agent.distribution)
				if (binary != null)
					return binary.args

				return agent.distribution.npx?.args ?? agent.distribution.uvx?.args
			},
			environmentKeys: (agent) => {
				const binary = unambiguousBinaryTarget(agent.distribution)
				if (binary != null)
					return Object.keys(binary.env ?? {})

				if (Object.keys(agent.distribution).length !== 1)
					return undefined

				const runnerEnv = agent.distribution.npx?.env ?? agent.distribution.uvx?.env
				return runnerEnv == null ? undefined : Object.keys(runnerEnv)
			},
		}),

		defineResolver({
			entityType: EntityType._GlobalAgentNetwork,
			resolve: {
				NetworkId: {
					resolve: async ({
						networkId,
					}) => {
						const timestampMs = Date.now()
						try {
							const { fetchRegistry } = await import('$/sources/Acp/Rest/queries.ts')
							const registry = await fetchRegistry()
							return {
								networkId,
								agentCount: registry.agents.length,
								$$acpPrograms: registry.agents.map(programReference),
								$$timestamps: [{
									[EntityMetaKey.Selector]: {
										$network: {
											networkId,
										},
										timestampMs,
										source: Source.AcpRegistry_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'sourceReportedAgentCount')]:
											registry.agents.length,
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'seededAgentCount')]:
											registry.agents.length,
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'declaredEndpointCount')]:
											1,
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'reachableEndpointCount')]:
											1,
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'status')]:
											'ok',
									},
								}],
							}
						} catch (error) {
							return {
								networkId,
								agentCount: 0,
								$$acpPrograms: [],
								$$timestamps: [{
									[EntityMetaKey.Selector]: {
										$network: {
											networkId,
										},
										timestampMs,
										source: Source.AcpRegistry_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'sourceReportedAgentCount')]:
											0,
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'seededAgentCount')]:
											0,
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'declaredEndpointCount')]:
											1,
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'reachableEndpointCount')]:
											0,
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'status')]:
											'error',
										[entityFieldAddressKey(EntityType._GlobalAgentNetwork_Timestamp, [], 'error')]:
											error instanceof Error ? error.message : String(error),
									},
								}],
							}
						}
					},
				},
			},
		})({
			$$acpPrograms: {
				select: (snapshot) => snapshot.$$acpPrograms,
				resolveCount: (snapshot) => snapshot.agentCount,
			},
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType._GlobalAgentNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						if (source !== Source.AcpRegistry_Rest)
							throw new Error('AcpRegistry_Rest: global agent observation source mismatch')

						const { fetchRegistry } = await import('$/sources/Acp/Rest/queries.ts')
						const registry = await fetchRegistry()
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							sourceReportedAgentCount: registry.agents.length,
							seededAgentCount: registry.agents.length,
							declaredEndpointCount: 1,
							reachableEndpointCount: 1,
							status: 'ok',
						}
					},
				},
			},
		})({
			$network: (observation) => observation.$network,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			sourceReportedAgentCount: (observation) => observation.sourceReportedAgentCount,
			seededAgentCount: (observation) => observation.seededAgentCount,
			declaredEndpointCount: (observation) => observation.declaredEndpointCount,
			reachableEndpointCount: (observation) => observation.reachableEndpointCount,
			status: (observation) => observation.status,
		}),
	],
} satisfies RegisteredSourceResolverModule
