import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum Eip8004AgentServiceEndpointSelector {
	RegistrationFileEndpointKindEndpointUrl = '$registrationFile+endpointKind+endpointUrl',
}
export default {
	entityType: EntityType.Eip8004AgentServiceEndpoint,
	label: 'eip8004 agent service endpoint',
	labelPlural: 'eip8004 agent service endpoints',
	selectors: [
		{
			name: Eip8004AgentServiceEndpointSelector.RegistrationFileEndpointKindEndpointUrl,
			fields: [
				'$registrationFile',
				'endpointKind',
				'endpointUrl',
			],
		},
	],
	fields: [
		{
			name: '$registrationFile',
			label: 'registration file',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Eip8004AgentRegistrationFile,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'endpointKind',
			label: 'endpoint kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'endpointUrl',
			label: 'endpoint URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'protocolKind',
			label: 'protocol kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'active',
			label: 'active',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$a2aAgentCard',
			label: 'a2a agent card',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.A2aAgentCard,
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
			name: '$$paymentRequirements',
			label: 'payment requirements',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AgentPaymentRequirement_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
