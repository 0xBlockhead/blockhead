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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$conversation: {
		entityType: EntityType.BlockheadAgentConversation,
		cardinality: EntityFieldCardinality.One,
	},
	userPrompt: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	assistantText: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type.enumerated(...Object.values(BlockheadAgentConversationTurnStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	providerId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	promptVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$providerCalls: {
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
