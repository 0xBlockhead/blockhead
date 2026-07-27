import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { fetchRegistry } from '$/sources/Acp/Rest/queries.ts'

export default {
	source: Source.AcpRegistry_Rest,

	resolvers: [
		defineResolver(Source.AcpRegistry_Rest, {
			entityType: EntityType.AcpAgentProgramVersion,
			resolve: {
				ProgramVersion: {
					resolve: async ({
						$program,
						version,
					}) => {
						if (!('registryAgentId' in $program))
							throw new Error('AcpRegistry_Rest: program selector must identify a registry agent')

						const agent = (await fetchRegistry()).agents.find((candidate) => (
							candidate.id === $program.registryAgentId
							&& candidate.version === version
						))
						if (agent == null)
							throw new Error(`AcpRegistry_Rest: registry agent ${$program.registryAgentId}@${version} was not found`)

						return agent
					},
				},
			},
		})({
			$program: (_agent, { $program }) => ({
				[EntityMetaKey.Selector]: $program,
			}),
			version: (agent) => agent.version,
			distribution: (agent) => agent.distribution,
			distributionKind: (agent) => (
				Object.keys(agent.distribution).length === 1 ?
					Object.keys(agent.distribution)[0]
				:
					undefined
			),
			command: (agent) => {
				const binary = agent.distribution.binary
				return binary == null || Object.keys(binary).length !== 1 ? undefined : Object.values(binary)[0].cmd
			},
			arguments: (agent) => {
				if (Object.keys(agent.distribution).length !== 1)
					return undefined

				const binary = agent.distribution.binary
				return binary == null ? agent.distribution.npx?.args ?? agent.distribution.uvx?.args : Object.keys(binary).length === 1 ? Object.values(binary)[0].args : undefined
			},
			environmentKeys: (agent) => {
				const binary = agent.distribution.binary
				return binary == null || Object.keys(binary).length !== 1 ? undefined : Object.keys(Object.values(binary)[0].env ?? {})
			},
		}),
	],
}
