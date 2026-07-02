// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.CosmosNetwork,
	label: 'Cosmos network',
	labelPlural: 'Cosmos networks',
	selectors: [
		{
			name: CosmosNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'restEndpoints',
				label: 'REST endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'Timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$blocks',
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosBlock,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$accounts',
				label: 'Accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosAccount,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$validators',
				label: 'Validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosValidator,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$governanceProposals',
				label: 'Governance proposals',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosGovernanceProposal,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
