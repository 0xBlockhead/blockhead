// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadAgentConversationTurnStatus {
	Pending = 'Pending',
	Generating = 'Generating',
	Complete = 'Complete',
	Error = 'Error',
	Cancelled = 'Cancelled',
}
export enum BlockheadAgentConversationTurnSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.BlockheadAgentConversationTurn,
	label: 'agent conversation turn',
	labelPlural: 'agent conversation turns',
	selectors: [
		{
			name: BlockheadAgentConversationTurnSelector.Id,
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
				name: 'id',
				label: 'ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$conversation',
				label: 'Conversation',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadAgentConversation,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'userPrompt',
				label: 'User prompt',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'assistantText',
				label: 'Assistant text',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'status',
				label: 'Status',
				type: EntityFieldType.Primitive,
				primitiveType: type.enumerated(...Object.values(BlockheadAgentConversationTurnStatus)),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'createdAt',
				label: 'Created',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'providerId',
				label: 'Provider',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'promptVersion',
				label: 'Prompt version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'parentId',
				label: 'Parent turn ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'error',
				label: 'Error',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
