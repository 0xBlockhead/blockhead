// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocolKind: {
		label: 'protocol kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$acpPrograms: {
		label: 'ACP programs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AcpAgentProgram,
		cardinality: EntityFieldCardinality.Many,
	},
	$$a2aCards: {
		label: 'A2A cards',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.A2aAgentCard,
		cardinality: EntityFieldCardinality.Many,
	},
	$$mcpServers: {
		label: 'MCP servers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$eip8004Registrations: {
		label: 'EIP-8004 registrations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Eip8004AgentRegistration,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadProfiles: {
		label: 'blockhead profiles',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadAgentProfile,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
