// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CashuKeyset,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	active: {
		label: 'active',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	inputFeePpk: {
		label: 'input fee ppk',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CashuMint_Rest,
		],
	},
	finalExpiryMs: {
		label: 'final expiry ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listedByKeysEndpoint: {
		label: 'listed by keys endpoint',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listedByKeysetsEndpoint: {
		label: 'listed by keysets endpoint',
		type: EntityFieldType.Primitive,
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
