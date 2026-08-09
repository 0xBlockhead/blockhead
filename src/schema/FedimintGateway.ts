// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
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
		defaultSources: [
			Source.FedimintGatewayd_Rest,
		],
	},
	apiUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.FedimintGatewayd_Rest,
		],
	},
	nodePubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.FedimintGatewayd_Rest,
		],
	},
	$$federations: {
		entityType: EntityType.FedimintFederation,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.FedimintGatewayd_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.FedimintGateway_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.FedimintGatewayd_Rest,
		],
	},
})({
	selectors: {
		GatewayId: [
			'gatewayId',
		],
	},
})
