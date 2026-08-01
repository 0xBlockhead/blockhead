// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FedimintGateway,
	labels: {
		singular: 'Fedimint gateway',
		plural: 'Fedimint gateways',
	},
})({
	gatewayId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	apiUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nodePubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$federations: {
		entityType: EntityType.FedimintFederation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.FedimintGateway_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		GatewayId: [
			'gatewayId',
		],
	},
})
