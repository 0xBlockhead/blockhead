// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const bitcoinCashBcmrGithubSources = [
	Source.BitcoinCashBcmr_Github,
] as const

export default entity({
	entityType: EntityType.BitcoinCashBcmrMetadata,
	labels: {
		singular: 'Bitcoin cash bcmr metadata',
		plural: 'Bitcoin Cash BCMR metadata entries',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	categoryId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	registryUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: bitcoinCashBcmrGithubSources,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: bitcoinCashBcmrGithubSources,
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: bitcoinCashBcmrGithubSources,
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: bitcoinCashBcmrGithubSources,
	},
})({
	selectors: {
		NetworkCategoryIdRegistryUrl: [
			'$network',
			'categoryId',
			'registryUrl',
		],
	},
})
