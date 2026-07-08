// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EnsRecord_TimestampSelector {
	RecordTimestampMsSource = 'RecordTimestampMsSource',
}
export const EnsRecord_Timestamp = entity({
	entityType: EntityType.EnsRecord_Timestamp,
	label: 'ENS record observation',
	labelPlural: 'ENS record observations',
})({
	$record: {
		label: 'Record',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EnsRecord,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		label: 'Value',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RecordTimestampMsSource: [
			'$record',
			'timestampMs',
			'source',
		],
	},
})
