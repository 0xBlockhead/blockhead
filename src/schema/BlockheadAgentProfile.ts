// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAgentProfile,
	labels: {
		singular: 'blockhead agent profile',
		plural: 'blockhead agent profiles',
	},
})({
	profileId: {
		label: 'profile ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mcpServer: {
		label: 'MCP server',
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$eip8004Registration: {
		label: 'EIP-8004 registration',
		entityType: EntityType.Eip8004AgentRegistration,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$model: {
		label: 'model',
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ProfileId: [
			'profileId',
		],
	},
})
