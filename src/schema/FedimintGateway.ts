// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FedimintGatewaySelector {
	GatewayId = 'GatewayId',
}
export const FedimintGateway = entity({
	entityType: EntityType.FedimintGateway,
	labels: {
		singular: 'Fedimint gateway',
		plural: 'Fedimint gateways',
	},
})({
	gatewayId: {
		label: 'gateway ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	apiUrl: {
		label: 'API URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nodePubkey: {
		label: 'node public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$federations: {
		label: 'federations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FedimintFederation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
