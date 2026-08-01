// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CosmosAccount,
	labels: {
		singular: 'Cosmos account',
		plural: 'Cosmos accounts',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.CosmosAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CosmosSdk_Rest,
			Source.Mintscan,
		],
	},
	$$transactions: {
		label: 'Transactions',
		entityType: EntityType.CosmosTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CosmosSdk_Rest,
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
