// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandNetwork,
	labels: {
		singular: 'algorand network',
		plural: 'algorand networks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$rounds: {
		label: 'rounds',
		entityType: EntityType.AlgorandRound,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		entityType: EntityType.AlgorandAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$applications: {
		label: 'applications',
		entityType: EntityType.AlgorandApplication,
		cardinality: EntityFieldCardinality.Many,
	},
	$$assets: {
		label: 'assets',
		entityType: EntityType.AlgorandAsset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tealPrograms: {
		label: 'TEAL programs',
		entityType: EntityType.AlgorandTealProgram,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.AlgorandTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.AlgorandNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
