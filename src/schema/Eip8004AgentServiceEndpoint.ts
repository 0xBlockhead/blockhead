// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Eip8004AgentServiceEndpoint,
	labels: {
		singular: 'EIP-8004 agent service endpoint',
		plural: 'EIP-8004 agent service endpoints',
	},
})({
	$registrationFile: {
		label: 'Registration file',
		entityType: EntityType.Eip8004AgentRegistrationFile,
		cardinality: EntityFieldCardinality.One,
	},
	endpointKind: {
		label: 'Endpoint kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpointUrl: {
		label: 'Endpoint URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'Version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocolKind: {
		label: 'Protocol kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	active: {
		label: 'Active',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mcpServer: {
		label: 'MCP server',
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$paymentRequirements: {
		label: 'Payment requirements',
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
