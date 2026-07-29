// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		label: 'card',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.A2aAgentCard,
		cardinality: EntityFieldCardinality.One,
	},
	protocolBinding: {
		label: 'protocol binding',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpointUrl: {
		label: 'endpoint URL',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	transportKind: {
		label: 'transport kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authKind: {
		label: 'auth kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$tasks: {
		label: 'tasks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.A2aTask,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
