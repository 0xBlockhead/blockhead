// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiAccountSelector {
	NetworkAddress = 'NetworkAddress',
}
export const SuiAccount = entity({
	entityType: EntityType.SuiAccount,
	labels: {
		singular: 'sui account',
		plural: 'sui accounts',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$balances: {
		label: 'balances',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$objects: {
		label: 'objects',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiTransaction,
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
