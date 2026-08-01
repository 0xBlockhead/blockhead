// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAgentConversation,
	labels: {
		singular: 'agent conversation',
		plural: 'agent conversations',
	},
})({
	id: {
		label: 'ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pinned: {
		label: 'Pinned',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	systemPrompt: {
		label: 'System prompt',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	defaultConnectionId: {
		label: 'Default connection ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	defaultModelId: {
		label: 'Default model ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$profile: {
		label: 'profile',
		entityType: EntityType.BlockheadAgentProfile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		label: 'Updated',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$turns: {
		label: 'Turns',
		entityType: EntityType.BlockheadAgentConversationTurn,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
