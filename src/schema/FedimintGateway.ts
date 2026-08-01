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
		label: 'gateway ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	apiUrl: {
		label: 'API URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nodePubkey: {
		label: 'node public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$federations: {
		label: 'federations',
		entityType: EntityType.FedimintFederation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
