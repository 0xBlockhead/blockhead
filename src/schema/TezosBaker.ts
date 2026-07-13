// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosBakerSelector {
	NetworkAddress = 'NetworkAddress',
}
export const TezosBaker = entity({
	entityType: EntityType.TezosBaker,
	labels: {
		singular: 'tezos baker',
		plural: 'tezos bakers',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$cycleTimestamps: {
		label: 'cycle timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBaker_Cycle_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBaker_Timestamp,
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
