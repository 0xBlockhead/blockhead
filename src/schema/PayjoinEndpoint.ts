// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PayjoinEndpointSelector {
	EndpointUrl = 'EndpointUrl',
}
export const PayjoinEndpoint = entity({
	entityType: EntityType.PayjoinEndpoint,
	label: 'payjoin endpoint',
	labelPlural: 'payjoin endpoints',
})({
	endpointUrl: {
		label: 'endpoint URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolVersion: {
		label: 'protocol version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$directory: {
		label: 'directory',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PayjoinDirectory,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.PayjoinEndpoint_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSessions: {
		label: 'blockhead sessions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadPayjoinSession,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EndpointUrl: [
			'endpointUrl',
		],
	},
})
