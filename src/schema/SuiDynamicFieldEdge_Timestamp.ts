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
		entityType: EntityType.SuiDynamicFieldEdge,
		cardinality: EntityFieldCardinality.One,
	},
	checkpointSequence: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fieldType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	childObjectType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
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
