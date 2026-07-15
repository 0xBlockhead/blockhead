// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiDynamicFieldEdge_TimestampSelector {
	EdgeCheckpointSequenceSource = 'EdgeCheckpointSequenceSource',
}
export const SuiDynamicFieldEdge_Timestamp = entity({
	entityType: EntityType.SuiDynamicFieldEdge_Timestamp,
	labels: {
		singular: 'sui dynamic field edge timestamp',
		plural: 'sui dynamic field edge observations',
	},
})({
	$edge: {
		label: 'edge',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiDynamicFieldEdge,
		cardinality: EntityFieldCardinality.One,
	},
	checkpointSequence: {
		label: 'checkpoint sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fieldType: {
		label: 'field type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	childObjectType: {
		label: 'child object type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EdgeCheckpointSequenceSource: [
			'$edge',
			'checkpointSequence',
			'source',
		],
	},
})
