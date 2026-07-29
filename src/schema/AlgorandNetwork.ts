// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$rounds: {
		label: 'rounds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandRound,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$applications: {
		label: 'applications',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandApplication,
		cardinality: EntityFieldCardinality.Many,
	},
	$$assets: {
		label: 'assets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandAsset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tealPrograms: {
		label: 'TEAL programs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandTealProgram,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AlgorandTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
