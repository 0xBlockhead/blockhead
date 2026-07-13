// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StarknetNetworkSelector {
	Network = 'Network',
}
export const StarknetNetwork = entity({
	entityType: EntityType.StarknetNetwork,
	labels: {
		singular: 'starknet network',
		plural: 'starknet networks',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		label: 'Chain ID',
		description: 'The chain identifier used by the network family.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StarknetNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StarknetBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StarknetTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contracts: {
		label: 'contracts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StarknetContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$classes: {
		label: 'classes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StarknetClass,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
