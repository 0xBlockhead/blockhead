// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum A2aAgentSkillSelector {
	CardSnapshotSkillId = 'CardSnapshotSkillId',
}
export default {
	entityType: EntityType.A2aAgentSkill,
	label: 'a2a agent skill',
	labelPlural: 'a2a agent skills',
	selectors: [
		{
			name: A2aAgentSkillSelector.CardSnapshotSkillId,
			fields: [
				'$cardSnapshot',
				'skillId',
			],
		},
	],
	fields: [
		{
			name: '$cardSnapshot',
			label: 'card snapshot',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aAgentCard_Snapshot,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'skillId',
			label: 'skill ID',
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
			name: 'tags',
			label: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'examples',
			label: 'examples',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'inputModes',
			label: 'input modes',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'outputModes',
			label: 'output modes',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
