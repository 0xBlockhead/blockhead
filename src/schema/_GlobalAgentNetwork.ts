// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalAgentNetwork,
	labels: {
		singular: 'global agent network',
		plural: 'global agent networks',
	},
})({
	networkId: {
		label: 'network ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocolKind: {
		label: 'protocol kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$acpPrograms: {
		label: 'ACP programs',
		entityType: EntityType.AcpAgentProgram,
		cardinality: EntityFieldCardinality.Many,
	},
	$$a2aCards: {
		label: 'A2A cards',
		entityType: EntityType.A2aAgentCard,
		cardinality: EntityFieldCardinality.Many,
	},
	$$mcpServers: {
		label: 'MCP servers',
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$eip8004Registrations: {
		label: 'EIP-8004 registrations',
		entityType: EntityType.Eip8004AgentRegistration,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadProfiles: {
		label: 'blockhead profiles',
		entityType: EntityType.BlockheadAgentProfile,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType._GlobalAgentNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkId: [
			'networkId',
		],
	},
})
