// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AlgorandAccountSelector {
	NetworkAddress = 'NetworkAddress',
}
export const AlgorandAccount = entity({
	entityType: EntityType.AlgorandAccount,
	labels: {
		singular: 'algorand account',
		plural: 'algorand accounts',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$applicationLocalStateRounds: {
		label: 'application local state rounds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandApplicationLocalState_Round,
		cardinality: EntityFieldCardinality.Many,
	},
	$$assetHoldingRounds: {
		label: 'asset holding rounds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandAssetHolding_Round,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
