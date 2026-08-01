// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$directory: {
		entityType: EntityType.PayjoinDirectory,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.PayjoinEndpoint_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSessions: {
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
