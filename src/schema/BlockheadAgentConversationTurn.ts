// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
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
	ConversationTurnId = 'ConversationTurnId',
}
export const BlockheadAgentConversationTurn = entity({
	entityType: EntityType.BlockheadAgentConversationTurn,
	labels: {
		singular: 'agent conversation turn',
		plural: 'agent conversation turns',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$conversation: {
		label: 'Conversation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadAgentConversation,
		cardinality: EntityFieldCardinality.One,
	},
	userPrompt: {
		label: 'User prompt',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assistantText: {
		label: 'Assistant text',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(BlockheadAgentConversationTurnStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	providerId: {
		label: 'Provider',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	promptVersion: {
		label: 'Prompt version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentId: {
		label: 'Parent turn ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'Error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$providerCalls: {
		label: 'provider calls',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadAgentProviderCall,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
		ConversationTurnId: [
			'$conversation',
			'id',
		],
	},
})
