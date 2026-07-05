// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FedimintGatewaySelector {
	GatewayId = 'GatewayId',
}
export default {
	entityType: EntityType.FedimintGateway,
	label: 'Fedimint gateway',
	labelPlural: 'Fedimint gateways',
	selectors: [
		{
			name: FedimintGatewaySelector.GatewayId,
			fields: [
				'gatewayId',
			],
		},
	],
	fields: [
		{
				name: 'gatewayId',
				label: 'gateway ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'apiUrl',
				label: 'API URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nodePubkey',
				label: 'node public key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$federations',
				label: 'federations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FedimintFederation,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FedimintGateway_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
