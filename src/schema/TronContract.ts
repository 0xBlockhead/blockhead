// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const tronScanRestSources = [
	Source.TronScan_Rest,
] as const

export default entity({
	entityType: EntityType.TronContract,
	labels: {
		singular: 'tron contract',
		plural: 'tron contracts',
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
	$account: {
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	$creator: {
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	$creationTransaction: {
		entityType: EntityType.TronTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: tronScanRestSources,
	},
	$$timestamps: {
		entityType: EntityType.TronContract_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: tronScanRestSources,
	},
	$$tokens: {
		entityType: EntityType.TronToken,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: tronScanRestSources,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
