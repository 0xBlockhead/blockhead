// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalSources = [
	Source.Constants_Internal,
] as const

export default entity({
	entityType: EntityType.EthereumNetworkUpgrade,
	labels: {
		singular: 'Ethereum network upgrade',
		plural: 'Ethereum network upgrades',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	upgradeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	slug: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	activationBlock: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activationTimestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activationEpoch: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$networkExecutionUpgrade: {
		entityType: EntityType.EthereumExecutionUpgrade,
		cardinality: EntityFieldCardinality.One,
		defaultSources: constantsInternalSources,
	},
	$networkConsensusUpgrade: {
		entityType: EntityType.EthereumConsensusUpgrade,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	$$proposals: {
		entityType: EntityType.SpecificationProposal,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalSources,
	},
})({
	selectors: {
		EvmNetworkUpgradeId: [
			'$network',
			'upgradeId',
		],
		EvmNetworkSlug: [
			'$network',
			'slug',
		],
	},
})
