import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export enum BlockheadAgentConversationTurnStatus {
	Pending = 'pending',
	Generating = 'generating',
	Complete = 'complete',
	Error = 'error',
	Cancelled = 'cancelled',
}

export default {
	entityType: EntityType.BlockheadAgentConversationTurn,

	label: 'Agent Conversation Turn',
	labelPlural: 'Agent Conversation Turns',

	id: type({
		id: 'string',
	}),

	fields: [
		{
			name: '$conversation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadAgentConversation,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'parentId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'userPrompt',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assistantText',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'providerId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BlockheadAgentConversationTurnStatus),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'promptVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$paymentWalletConnection',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadWalletConnection,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
