// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.A2aArtifact,
	labels: {
		singular: 'a2a artifact',
		plural: 'a2a artifacts',
	},
})({
	$task: {
		label: 'task',
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.One,
	},
	artifactId: {
		label: 'artifact ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$aiArtifact: {
		label: 'AI artifact',
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$parts: {
		label: 'parts',
		entityType: EntityType.A2aMessagePart,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TaskArtifactId: [
			'$task',
			'artifactId',
		],
	},
})
