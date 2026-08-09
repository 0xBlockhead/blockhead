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
		entityType: EntityType.Eip8004AgentRegistrationFile,
		cardinality: EntityFieldCardinality.One,
	},
	endpointKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpointUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocolKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	active: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mcpServer: {
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
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
