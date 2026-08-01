// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CashuKeyset_Timestamp,
	labels: {
		singular: 'Cashu keyset timestamp',
		plural: 'Cashu keyset observations',
	},
})({
	$keyset: {
		label: 'keyset',
		entityType: EntityType.CashuKeyset,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	active: {
		label: 'active',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	inputFeePpk: {
		label: 'input fee ppk',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	finalExpiryMs: {
		label: 'final expiry ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listedByKeysEndpoint: {
		label: 'listed by keys endpoint',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listedByKeysetsEndpoint: {
		label: 'listed by keysets endpoint',
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
