import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum BlockheadAgentConversationSelector {
	Id = 'id',
}

export default {
	entityType: EntityType.BlockheadAgentConversation,

	label: 'Agent conversation',
	labelPlural: 'Agent conversations',

	selectors: [
		{
			name: BlockheadAgentConversationSelector.Id,
			fields: [
				'id',
			],
		},
	],

	fields: [
		{
			name: 'id',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pinned',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'systemPrompt',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'defaultConnectionId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'defaultModelId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'updatedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$turns',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadAgentConversationTurn,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
