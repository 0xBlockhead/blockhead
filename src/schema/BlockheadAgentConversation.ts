import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadAgentConversationSelector {
	Id = 'id',
}
export default {
	entityType: EntityType.BlockheadAgentConversation,
	label: 'blockhead agent conversation',
	labelPlural: 'blockhead agent conversations',
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
			label: 'ID',
			description: 'The identifier assigned by the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string | null"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pinned',
			label: 'pinned',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'systemPrompt',
			label: 'system prompt',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'defaultConnectionId',
			label: 'default connection ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string | null"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'defaultModelId',
			label: 'default model ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string | null"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$profile',
			label: 'profile',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadAgentProfile,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$acpSession',
			label: 'acp session',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AcpSession,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$a2aTask',
			label: 'a2a task',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aTask,
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
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$turns',
			label: 'turns',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadAgentConversationTurn,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	],
} as const satisfies EntityDefinition
