// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mcpServer: {
		label: 'MCP server',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$eip8004Registration: {
		label: 'EIP-8004 registration',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Eip8004AgentRegistration,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$model: {
		label: 'model',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		type: EntityFieldType.Primitive,
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
