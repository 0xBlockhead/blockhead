// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const cashuMintRestSources = [
	Source.CashuMint_Rest,
] as const

export default entity({
	entityType: EntityType.CashuKeyset_Timestamp,
	labels: {
		singular: 'Cashu keyset timestamp',
		plural: 'Cashu keyset observations',
	},
})({
	$keyset: {
		entityType: EntityType.CashuKeyset,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	active: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: cashuMintRestSources,
	},
	inputFeePpk: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: cashuMintRestSources,
	},
	finalExpiryMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listedByKeysEndpoint: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listedByKeysetsEndpoint: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		KeysetTimestampMsSource: [
			'$keyset',
			'timestampMs',
			'source',
		],
	},
})
