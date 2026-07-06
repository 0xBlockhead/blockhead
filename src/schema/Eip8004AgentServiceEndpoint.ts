// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum Eip8004AgentServiceEndpointSelector {
	RegistrationFileEndpointKindEndpointUrl = 'RegistrationFileEndpointKindEndpointUrl',
}
export default {
	entityType: EntityType.Eip8004AgentServiceEndpoint,
	label: 'EIP-8004 agent service endpoint',
	labelPlural: 'EIP-8004 agent service endpoints',
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
			label: 'Registration file',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Eip8004AgentRegistrationFile,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'endpointKind',
			label: 'Endpoint kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'endpointUrl',
			label: 'Endpoint URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			label: 'Version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'protocolKind',
			label: 'Protocol kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'active',
			label: 'Active',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
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
			name: '$$paymentRequirements',
			label: 'Payment requirements',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AgentPaymentRequirement_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
