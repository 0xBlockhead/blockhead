// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default entity({
	entityType: EntityType.AlgorandNetwork,
	labels: {
		singular: 'algorand network',
		plural: 'algorand networks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$rounds: {
		entityType: EntityType.AlgorandRound,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		entityType: EntityType.AlgorandAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$applications: {
		entityType: EntityType.AlgorandApplication,
		cardinality: EntityFieldCardinality.Many,
	},
	$$assets: {
		entityType: EntityType.AlgorandAsset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tealPrograms: {
		entityType: EntityType.AlgorandTealProgram,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.AlgorandTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
