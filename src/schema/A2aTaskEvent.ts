// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.A2aTaskEvent,
	labels: {
		singular: 'a2a task event',
		plural: 'a2a task events',
	},
})({
	$task: {
		label: 'task',
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.One,
	},
	sequence: {
		label: 'sequence',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	eventKind: {
		label: 'event kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'state',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	final: {
		label: 'final',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		label: 'artifact',
		entityType: EntityType.A2aArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TaskSequence: [
			'$task',
			'sequence',
		],
	},
})
