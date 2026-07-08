// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EnsReverseRecord_TimestampSelector {
	ReverseRecordTimestampMsSource = 'ReverseRecordTimestampMsSource',
}
export const EnsReverseRecord_Timestamp = entity({
	entityType: EntityType.EnsReverseRecord_Timestamp,
	label: 'ENS reverse record timestamp',
	labelPlural: 'ENS reverse record observations',
})({
	$reverseRecord: {
		label: 'Reverse record',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EnsReverseRecord,
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
	verified: {
		label: 'Verified',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolverSelector: {
		label: 'Resolver selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ReverseRecordTimestampMsSource: [
			'$reverseRecord',
			'timestampMs',
			'source',
		],
	},
})
