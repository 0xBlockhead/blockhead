import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadAgentConversationTurnStatus {
	Pending = 'pending',
	Generating = 'generating',
	Complete = 'complete',
	Error = 'error',
	Cancelled = 'cancelled',
}
export enum BlockheadAgentConversationTurnSelector {
	Id = 'id',
}
export default {
	entityType: EntityType.BlockheadAgentConversationTurn,
	label: 'blockhead agent conversation turn',
	labelPlural: 'blockhead agent conversation turns',
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
			description: 'The identifier assigned by the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$conversation',
			label: 'conversation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadAgentConversation,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'parentId',
			label: 'parent ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string | null"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'userPrompt',
			label: 'user prompt',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'assistantText',
			label: 'assistant text',
			type: EntityFieldType.Primitive,
			primitiveType: type("string | null"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'providerId',
			label: 'provider ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string | null"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'promptVersion',
			label: 'prompt version',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$acpPromptTurn',
			label: 'acp prompt turn',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AcpPromptTurn,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$a2aTaskEvent',
			label: 'a2a task event',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aTaskEvent,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$providerCalls',
			label: 'provider calls',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadAgentProviderCall,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
