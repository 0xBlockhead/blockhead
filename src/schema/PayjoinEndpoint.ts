// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PayjoinEndpoint,
	labels: {
		singular: 'payjoin endpoint',
		plural: 'payjoin endpoints',
	},
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
