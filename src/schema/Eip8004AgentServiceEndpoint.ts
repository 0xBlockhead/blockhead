// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum Eip8004AgentServiceEndpointSelector {
	RegistrationFileEndpointKindEndpointUrl = 'RegistrationFileEndpointKindEndpointUrl',
}
export const Eip8004AgentServiceEndpoint = entity({
	entityType: EntityType.Eip8004AgentServiceEndpoint,
	labels: {
		singular: 'EIP-8004 agent service endpoint',
		plural: 'EIP-8004 agent service endpoints',
	},
})({
	$registrationFile: {
		label: 'Registration file',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Eip8004AgentRegistrationFile,
		cardinality: EntityFieldCardinality.One,
	},
	endpointKind: {
		label: 'Endpoint kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpointUrl: {
		label: 'Endpoint URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'Version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocolKind: {
		label: 'Protocol kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	active: {
		label: 'Active',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mcpServer: {
		label: 'MCP server',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$paymentRequirements: {
		label: 'Payment requirements',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AgentPaymentRequirement_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RegistrationFileEndpointKindEndpointUrl: [
			'$registrationFile',
			'endpointKind',
			'endpointUrl',
		],
	},
})
