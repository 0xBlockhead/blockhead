// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.TronNetwork,
	label: 'tron network',
	labelPlural: 'tron networks',
	selectors: [
		{
			name: TronNetworkSelector.Network,
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
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: '$$blocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronBlock,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronFullNode_Rest,
				Source.TronSolidityNode_Rest,
			],
		},
		{
			name: '$$tokens',
			label: 'Tokens',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronToken,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenTransfers',
			label: 'Token transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$witnesses',
			label: 'Witnesses',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronWitness,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
