// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
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
		defaultSources: [
			Source.AptosFullnode_Rest,
		],
	},
	$$balances: {
		label: 'balances',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.AptosIndexer_Graphql,
		],
	},
	$$resources: {
		label: 'resources',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosAccountResource,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.AptosFullnode_Rest,
		],
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.AptosIndexer_Graphql,
		],
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
