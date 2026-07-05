// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalAgentNetworkSelector {
	NetworkId = 'NetworkId',
}
export default {
	entityType: EntityType._GlobalAgentNetwork,
	label: 'global agent network',
	labelPlural: 'global agent networks',
	selectors: [
		{
			name: _GlobalAgentNetworkSelector.NetworkId,
			fields: [
				'networkId',
			],
		},
	],
	fields: [
		{
				name: 'networkId',
				label: 'network ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'label',
				label: 'Label',
				description: 'A human-readable name for the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'protocolKind',
				label: 'protocol kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$acpPrograms',
				label: 'ACP programs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AcpAgentProgram,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$a2aCards',
				label: 'A2A cards',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.A2aAgentCard,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$mcpServers',
				label: 'MCP servers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.McpServer,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$eip8004Registrations',
				label: 'EIP-8004 registrations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.Eip8004AgentRegistration,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$blockheadProfiles',
				label: 'blockhead profiles',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadAgentProfile,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType._GlobalAgentNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
