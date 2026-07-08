// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronNetworkSelector {
	Network = 'Network',
}
export const TronNetwork = entity({
	entityType: EntityType.TronNetwork,
	label: 'tron network',
	labelPlural: 'tron networks',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	restEndpoints: {
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
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TronNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.TronGrid_Rest,
		],
	},
	$$blocks: {
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
	$$tokens: {
		label: 'Tokens',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TronToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		label: 'Token transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TronTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$witnesses: {
		label: 'Witnesses',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TronWitness,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.TronGrid_Rest,
		],
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
