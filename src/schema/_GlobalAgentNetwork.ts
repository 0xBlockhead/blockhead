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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocolKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$acpPrograms: {
		entityType: EntityType.AcpAgentProgram,
		cardinality: EntityFieldCardinality.Many,
	},
	$$a2aCards: {
		entityType: EntityType.A2aAgentCard,
		cardinality: EntityFieldCardinality.Many,
	},
	$$mcpServers: {
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$eip8004Registrations: {
		entityType: EntityType.Eip8004AgentRegistration,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadProfiles: {
		entityType: EntityType.BlockheadAgentProfile,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
