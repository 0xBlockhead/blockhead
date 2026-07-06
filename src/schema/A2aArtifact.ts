// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum A2aArtifactSelector {
	TaskArtifactId = 'TaskArtifactId',
}
export default {
	entityType: EntityType.A2aArtifact,
	label: 'a2a artifact',
	labelPlural: 'a2a artifacts',
	selectors: [
		{
			name: A2aArtifactSelector.TaskArtifactId,
			fields: [
				'$task',
				'artifactId',
			],
		},
	],
	fields: [
		{
			name: '$task',
			label: 'task',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aTask,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'artifactId',
			label: 'artifact ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			description: 'A human-readable description from the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$aiArtifact',
			label: 'AI artifact',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiArtifact,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$parts',
			label: 'parts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.A2aMessagePart,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
