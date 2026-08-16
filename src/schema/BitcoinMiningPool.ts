// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitcoinMiningPool,
	labels: {
		singular: 'Bitcoin mining pool',
		plural: 'Bitcoin mining pools',
	},
	description: 'A named Bitcoin mining-pool catalog subject that attributes coinbase-identified blocks on one UTXO network. Pool identity is the catalog slug, not a block, hashrate observation, or Network_Timestamp field.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	slug: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	uniqueId: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	websiteUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	coinbaseTagRegexes: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	$$coinbaseAddresses: {
		entityType: EntityType.UtxoAddress,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.BitcoinMiningPool_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
})({
	selectors: {
		NetworkSlug: [
			'$network',
			'slug',
		],
	},
})
