import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadAgentProfileSelector {
	ProfileId = 'profileId',
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
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$acpRuntime',
			label: 'acp runtime',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AcpAgentRuntime,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$a2aService',
			label: 'a2a service',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aAgentService,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$mcpServer',
			label: 'mcp server',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.McpServer,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$eip8004Registration',
			label: 'eip8004 registration',
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
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
