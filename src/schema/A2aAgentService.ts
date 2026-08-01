// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.A2aAgentService,
	labels: {
		singular: 'a2a agent service',
		plural: 'a2a agent services',
	},
})({
	$card: {
		entityType: EntityType.A2aAgentCard,
		cardinality: EntityFieldCardinality.One,
	},
	protocolBinding: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpointUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	transportKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$tasks: {
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.A2aAgentService_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		CardProtocolBindingEndpointUrl: [
			'$card',
			'protocolBinding',
			'endpointUrl',
		],
	},
})
