// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { BlockheadAgentConversationTurnStatus } from '$/schema/BlockheadAgentConversationTurnStatus.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAgentConversationTurn,
	labels: {
		singular: 'agent conversation turn',
		plural: 'agent conversation turns',
	},
})({
	id: {
		label: 'ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$conversation: {
		label: 'Conversation',
		entityType: EntityType.BlockheadAgentConversation,
		cardinality: EntityFieldCardinality.One,
	},
	userPrompt: {
		label: 'User prompt',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assistantText: {
		label: 'Assistant text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'Status',
		primitiveType: type.enumerated(...Object.values(BlockheadAgentConversationTurnStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	providerId: {
		label: 'Provider',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	promptVersion: {
		label: 'Prompt version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentId: {
		label: 'Parent turn ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'Error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$providerCalls: {
		label: 'provider calls',
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
