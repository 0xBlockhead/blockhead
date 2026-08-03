// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const aptosFullnodeRestSources = [
	Source.AptosFullnode_Rest,
] as const
const aptosIndexerGraphqlSources = [
	Source.AptosIndexer_Graphql,
] as const

export default entity({
	entityType: EntityType.AptosAccount,
	labels: {
		singular: 'aptos account',
		plural: 'aptos accounts',
	},
})({
	$network: {
		entityType: EntityType.AptosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.AptosAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: aptosFullnodeRestSources,
	},
	$$balances: {
		entityType: EntityType.AptosCoinBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: aptosIndexerGraphqlSources,
	},
	$$resources: {
		entityType: EntityType.AptosAccountResource,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: aptosFullnodeRestSources,
	},
	$$transactions: {
		entityType: EntityType.AptosTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: aptosIndexerGraphqlSources,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
