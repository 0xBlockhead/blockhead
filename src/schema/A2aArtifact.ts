// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum A2aArtifactSelector {
	TaskArtifactId = 'TaskArtifactId',
}
export const A2aArtifact = entity({
	entityType: EntityType.A2aArtifact,
	labels: {
		singular: 'a2a artifact',
		plural: 'a2a artifacts',
	},
})({
	$task: {
		label: 'task',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.One,
	},
	artifactId: {
		label: 'artifact ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$aiArtifact: {
		label: 'AI artifact',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$parts: {
		label: 'parts',
		type: EntityFieldType.EntitiesReference,
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
