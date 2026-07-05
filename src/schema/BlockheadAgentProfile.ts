// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadAgentProfileSelector {
	ProfileId = 'ProfileId',
}
export default {
	entityType: EntityType.BlockheadAgentProfile,
	label: 'blockhead agent profile',
	labelPlural: 'blockhead agent profiles',
	selectors: [
		{
			name: BlockheadAgentProfileSelector.ProfileId,
			fields: [
				'profileId',
			],
		},
	],
	fields: [
		{
				name: 'profileId',
				label: 'profile ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'label',
				label: 'Label',
				description: 'A human-readable name for the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$mcpServer',
				label: 'MCP server',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.McpServer,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$eip8004Registration',
				label: 'EIP-8004 registration',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Eip8004AgentRegistration,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$model',
				label: 'model',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AiModel,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'createdAt',
				label: 'Created',
				description: 'The time when the subject was created according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'updatedAt',
				label: 'Updated',
				description: 'The time when the subject was last updated according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
