// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TronAccount,
	labels: {
		singular: 'tron account',
		plural: 'tron accounts',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	$contract: {
		entityType: EntityType.TronContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.TronAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronScan_Rest,
		],
	},
	$$tokenBalanceTimestamps: {
		entityType: EntityType.TronAccountTokenBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	$$transactions: {
		entityType: EntityType.TronTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronScan_Rest,
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
