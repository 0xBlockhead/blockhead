// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AptosAccountSelector {
	NetworkAddress = 'NetworkAddress',
}
export const AptosAccount = entity({
	entityType: EntityType.AptosAccount,
	labels: {
		singular: 'aptos account',
		plural: 'aptos accounts',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AptosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$balances: {
		label: 'balances',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$resources: {
		label: 'resources',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosAccountResource,
		cardinality: EntityFieldCardinality.Many,
	},
	$$modules: {
		label: 'modules',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosTransaction,
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
