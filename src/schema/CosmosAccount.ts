// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosAccountSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.CosmosAccount,
	label: 'Cosmos account',
	labelPlural: 'Cosmos accounts',
	selectors: [
		{
			name: CosmosAccountSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$timestamps',
				label: 'Timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosAccount_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$transactions',
				label: 'Transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
