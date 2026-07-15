// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLocalMediaIngest_TimestampSelector {
	IngestTimestampMsSource = 'IngestTimestampMsSource',
}
export const BlockheadLocalMediaIngest_Timestamp = entity({
	entityType: EntityType.BlockheadLocalMediaIngest_Timestamp,
	labels: {
		singular: 'local media ingest timestamp',
		plural: 'local media ingest observations',
	},
})({
	$ingest: {
		label: 'ingest',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadLocalMediaIngest,
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
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	uri: {
		label: 'URI',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		IngestTimestampMsSource: [
			'$ingest',
			'timestampMs',
			'source',
		],
	},
})
