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
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.One,
	},
	artifactId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$aiArtifact: {
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$parts: {
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
