// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiDynamicFieldEdge_Timestamp,
	labels: {
		singular: 'sui dynamic field edge timestamp',
		plural: 'sui dynamic field edge observations',
	},
})({
	$edge: {
		label: 'edge',
		entityType: EntityType.SuiDynamicFieldEdge,
		cardinality: EntityFieldCardinality.One,
	},
	checkpointSequence: {
		label: 'checkpoint sequence',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fieldType: {
		label: 'field type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	childObjectType: {
		label: 'child object type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
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
