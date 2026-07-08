// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CashuKeyset_TimestampSelector {
	KeysetTimestampMsSource = 'KeysetTimestampMsSource',
}
export const CashuKeyset_Timestamp = entity({
	entityType: EntityType.CashuKeyset_Timestamp,
	label: 'Cashu keyset timestamp',
	labelPlural: 'Cashu keyset observations',
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
	},
	inputFeePpk: {
		label: 'input fee ppk',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
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
